const { Server } = require('socket.io');

let io;

const createSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ['https://savidgeapps.com', 'http://localhost:5173'],
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connect:', socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};

const emitFollowerUpdate = (data) => {
    if (io) {
        io.emit('followerUpdate', data);
    }
};

const emitSubscriberUpdate = (data) => {
    if (io) {
        io.emit('subscriberUpdate', data);
    }
};

module.exports = {
    createSocket,
    emitFollowerUpdate,
    emitSubscriberUpdate
};