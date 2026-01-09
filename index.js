const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    socket.on('send-message', (data) => {
        io.to(data.roomId).emit('receive-message', data);
    });

    // वीडियो कॉल शुरू करने का सिग्नल
    socket.on('start-video-signal', (roomId) => {
        socket.to(roomId).emit('video-started');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
