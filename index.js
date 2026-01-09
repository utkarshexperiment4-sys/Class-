const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // GitHub Pages को एक्सेस देने के लिए
        methods: ["GET", "POST"]
    }
});

const activeRooms = {};

io.on('connection', (socket) => {
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);

        if (!activeRooms[roomId]) {
            // 30 मिनट (1800000ms) का टाइमर
            activeRooms[roomId] = setTimeout(() => {
                io.to(roomId).emit('error-msg', 'समय समाप्त! यह चैट रूम बंद हो गया है।');
                delete activeRooms[roomId];
            }, 1800000);
        }
    });

    socket.on('send-msg', (data) => {
        io.to(data.roomId).emit('receive-msg', data.message);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

