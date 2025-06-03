const WebSocket = require("ws");
const axios = require("axios");

const clientID = process.env.TWITCH_CLIENT_ID;

const { emitFollowerUpdate, emitSubscriberUpdate } = require("../sockets/eventSocket");

class TwitchEventSocket {
    constructor() {
        this.clientID = clientID;
        this.streamerID = "";
        this.accessToken = "";
        this.sessionID = "";
        this.msgQueue = new Set();
        this.started = false;

        this.handlers = {
            "channel.follow"    : (e) => { console.log(`[follow] ${e.user_name}`); emitFollowerUpdate(e); },
            "channel.subscribe" : (e) => { console.log(`[sub] ${e.user_name}`); emitSubscriberUpdate(e); },
        };

        this.subscriptions = [
            {
                id: "",
                status: "disabled",
                type: "channel.follow",
                version: "2",
                condition: {
                    broadcaster_user_id: "$streamerID",
                    moderator_user_id: "$streamerID"
                },
            },
            {
                id: "",
                status: "disabled",
                type: "channel.subscribe",
                version: "1",
                condition: {
                    broadcaster_user_id: "$streamerID"
                },
            }
        ];
    }

    setCondition() {
        for (const spec of this.subscriptions) {
            const c = spec.condition;
            if (c.broadcaster_user_id === "$streamerID") c.broadcaster_user_id =  this.streamerID;
            if (c.moderator_user_id === "$streamerID") c.moderator_user_id =  this.streamerID;
        }
    }

    setStreamerID(id) { this.streamerID = id; }
    async updateAccessToken(token) { this.accessToken = token; await this.stop(); }

    async start() {
        if (!this.streamerID || this.streamerID === "") { console.warn("Streamer ID not found."); return false; }
        if (this.started) { console.warn("Socket already started."); return false; }
        if (!this.accessToken) { console.warn("No access token."); return false; }
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.warn("WebSocket already open."); return false;
        }

        this.setCondition();

        this.started = true;

        this.ws = new WebSocket("wss://eventsub.wss.twitch.tv/ws");

        this.ws.on("open", () => console.log("WebSocket connection opened."));
        this.ws.on("message", async (data) => await this.handleEventMessage(data));
        this.ws.on("close", () => console.warn("WebSocket connection closed."));
        this.ws.on("error", (err) => console.log("WebSocket error:", err));

        return true;
    }

    async stop() {
        if (!this.started) return;

        await this.unsubscribeAll();

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.close(1000, "client shutdown");
        }

        this.started = false;
        this.sessionID = ""
        this.msgQueue.clear();
        console.log("Twitch Event Socket stopped.");
    }

    async reconnect(reconnectUrl) {
        if (!reconnectUrl) {
            console.warn("No reconnect URL found.");
            return;
        }
        if (!this.started) {
            console.warn("Socket not yet started, cannot reconnect.");
            return;
        }

        console.log("Starting to reconnect to:", reconnectUrl);
        const oldWs= this.ws;

        const newWs = new WebSocket(reconnectUrl);

        newWs.on("open", () => console.log("Re-connect: socket opened."));
        newWs.on("message", async (data) => {
            const type = await this.handleEventMessage(data);
            if (type === "session_welcome") {
                console.log("Re-connect: welcome received, closing old WebSocket.");

                if (oldWs && oldWs.readyState === WebSocket.OPEN) {
                    oldWs.close(1000, "reconnected");
                }

                this.ws = newWs;
            }
        });
        newWs.on("close", () => console.warn("Re-connect: socket closed."));
        newWs.on("error", (err) => console.warn("Re-connect: socket error:", err));
    }

    async handleEventMessage(data) {
        let msg;
        try { msg = JSON.parse(data); }
        catch (e) { console.error("Bad JSON received from notification."); return ""; }

        const id = msg.metadata?.message_id;
        const type = msg.metadata?.message_type;

        if (!id || this.msgQueue.has(id)) return "";
        this.msgQueue.add(id);
        if (this.msgQueue.size > 100) {
            const first = this.msgQueue.values().next().value;
            this.msgQueue.delete(first);
        }

        switch (type) {
            case "session_welcome":
                this.sessionID = msg.payload?.session?.id ?? "";
                if (!this.sessionID) { console.warn("No session ID!"); return ""; }
                console.log("Session:", this.sessionID);
                await this.subscribeToEvents();
                return "session_welcome";

            case "session_keepalive":
                return "session_keepalive";

            case "session_reconnect":
                const url = msg.payload?.session?.reconnect_url;
                console.warn("Session reconnecting.");
                this.reconnect(url);
                return "session_reconnect";

            case "revocation":
                const revokeID = msg.payload?.subscription?.id;
                console.log("Revocation received.");
                await this.unsubscribe(revokeID);
                return "revocation";

            case "notification":
                console.log("Notification received.");
                await this.handleNotification(msg.payload);
                return "notification";

            default:
                console.log("Unknown message type:", type);
                return "";
        }
    }

    async subscribeToEvents() {
        for (const spec of this.subscriptions) {
            try {
                const { data } = await axios.post(
                    "https://api.twitch.tv/helix/eventsub/subscriptions",
                    {
                        type: spec.type,
                        version: spec.version,
                        condition: spec.condition,
                        transport: {
                            method: "websocket",
                            session_id: this.sessionID
                        }
                    },
                    {
                        headers: {
                            "Client-ID": this.clientID,
                            "Authorization": `Bearer ${this.accessToken}`,
                            "Content-Type": "application/json",
                        }
                    }
                );

                const sub = data?.data?.[0];
                if (sub?.id && sub.status === "enabled") {
                    spec.id = sub.id;
                    spec.status = sub.status;
                    console.log(`Subscribed to ${spec.type} (${sub.id})`);
                }
                else {
                    console.error(`Bad sub response for ${spec.type}`);
                }
            }
            catch (err) {
                console.error(`Sub ${spec.type} failed:`, err.response?.data || err.message);
            }
        }
    }

    async unsubscribe(id) {
        const spec = this.subscriptions.find(s => s.id === id);

        if (!spec) {
            console.warn(`No subscription with ID ${id} found.`);
            return false;
        }

        try {
            const res = await axios.delete(
                "https://api.twitch.tv/helix/eventsub/subscriptions",
                {
                    params: { id },
                    headers: {
                        "Client-ID": this.clientID,
                        "Authorization": `Bearer ${this.accessToken}`,
                    }
                }
            );

            if (res.status === 204) {
                spec.id = "";
                spec.status = "disabled";
                console.log(`Unsubscribed from ${spec.type}`);
                return true;
            }
            else {
                console.warn(`Unexpected status code while unsubscribing: ${res.status}`);
                return false;
            }
        }
        catch (err) {
            console.error(`Failed to unsubscribe from ${spec.type}:`, err.response?.data || err.message);
            return false;
        }
    }

    async unsubscribeAll() {
        const activeSubs = this.subscriptions.filter(s => s.id);
        for (const sub of activeSubs) {
            await this.unsubscribe(sub.id);
        }
    }

    async handleNotification(payload) {
        if (!payload?.event || !payload.subscription?.type) {
            console.warn("Received incomplete notification message.");
            return;
        }
        const type = payload.subscription.type;
        const handler = this.handlers[type];
        if (!handler) {
            console.warn("No handler for event type:", type);
            return;
        }
        try {
            await handler(payload.event);
        }
        catch (err) {
            console.error(`Handler for ${type} threw:`, err);
        }
    }
}

const instance = new TwitchEventSocket();
module.exports = instance;