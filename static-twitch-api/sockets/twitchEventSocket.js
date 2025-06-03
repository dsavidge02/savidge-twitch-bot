const axios = require('axios');
const WebSocket = require("ws");
const { getStreamerId } = require("../utils/twitchAuthService");
require('dotenv').config();

const clientId = process.env.TWITCH_CLIENT_ID;

let ws = null;
let sessionId = null;
let keepAliveTimeout = null;
let msgIds = [];
const KEEPALIVE_BUFFER = 10 * 1000;

let accessToken = null;

const startTwitchEventSocket = async (access_token) => {
    accessToken = access_token;
    console.log(`access token: ${accessToken}`);
    console.log("Connecting to Twitch EventSub Websocket.");

    ws = new WebSocket("wss://eventsub.wss.twitch.tv/ws");

    ws.on("open", () => {
        console.log("WebSocket connection opened.");
    });

    ws.on("message", async (data) => {
        await handleTwitchEventMessage(data);
    });

    ws.on("close", () => {
        console.warn("Websocket closed. Reconnect in 5s...");
        clearTimeout(keepAliveTimeout);
        setTimeout(startTwitchEventSocket, 5000);
    });

    ws.on("error", (err) => {
        console.error("Websocket error:", err);
    });
};

const scheduleKeepAlive = (timeoutSeconds) => {
    if (keepAliveTimeout) clearTimeout(keepAliveTimeout);
    keepAliveTimeout = setTimeout(() => {
        console.warn("Missed keepalive! Reconnecting...");
        startTwitchEventSocket();
    }, (timeoutSeconds || 60) * 1000 + KEEPALIVE_BUFFER);
};

const handleTwitchEventMessage = async (data) => {
    const msg = JSON.parse(data);
    const msgId = msg.metadata?.message_id;
    if (msgIds.includes(msgId)) {
        console.warn("Ignoring message with duplicate message id:", )
    }
    else {
        msgIds.push(msgId);
        if (msgIds.length > 100) msgIds.shift();
    }
    const type = msg.metadata?.message_type;
    const payload = msg.payload;

    switch (type) {
        case "session_welcome":
            sessionId = payload.session.id;
            console.log("Session id received:", sessionId);
            scheduleKeepAlive(payload.session.keepalive_timeout_seconds);
            await subscribeToEvents();
            break;

        case "session_keepalive":
            console.log("Keepalive received.");
            scheduleKeepAlive(payload.session?.keepalive_timeout_seconds);
            break;

        case "notification":
            handleNotification(payload);
            break;

        case "session_reconnect":
            console.log("Recconect requested to URL:", payload.session.reconnect_url);
            reconnectToUrl(payload.session.reconnect_url);
            break;
        
        case "revocation":
            console.warn("Subscription revoked:", payload.subscription);
            break;
        
        case "session_closed":
            console.warn("Session closed. Attempting to reconnect...");
            startTwitchEventSocket();
            break;
        
        default:
            console.log("Unknown message type:", type);
    }
};

const subscribeToEvents = async () => {
    const broadcasterId = getStreamerId();

    const subscriptions = [
        {
            type: "channel.follow",
            version: "2",
            condition: {
                broadcaster_user_id: broadcasterId,
                moderator_user_id: broadcasterId
            }
        },
        {
            type: "channel.subscribe",
            version: "1",
            condition: {
                broadcaster_user_id: broadcasterId
            }
        }
    ];

    for (const sub of subscriptions) {
        try {
            await axios.post(
                "https://api.twitch.tv/helix/eventsub/subscriptions",
                {
                    ...sub,
                    transport: {
                        method: "websocket",
                        session_id: sessionId,
                    }
                },
                {
                    headers: {
                        "Client-ID": clientId,
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(`Subscribed to ${sub.type}`);
        }
        catch (err) {
            console.error(`Failed to subscribe to ${sub.type}:`, err.response?.data || err.message);
        }
    }
};

module.exports = {
    startTwitchEventSocket
};