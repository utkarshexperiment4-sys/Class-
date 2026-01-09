const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    // रूम जॉइन करना
    socket.on('join-room', (data) => {
        socket.join(data.roomId);
        console.log(`User joined room: ${data.roomId}`);
    });

    // एन्क्रिप्टेड मैसेज भेजना
    socket.on('send-msg', (data) => {
        // data में roomId, user, और encrypted text है
        io.to(data.roomId).emit('receive-msg', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Render अक्सर 10000 पोर्ट का इस्तेमाल करता है
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
