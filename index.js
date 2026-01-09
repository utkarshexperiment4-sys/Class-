const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const activeRooms = {};

io.on('connection', (socket) => {
    // जब कोई रूम जॉइन करे
    socket.on('join-room', (data) => {
        socket.join(data.roomId);
        
        // 30 मिनट का ऑटो-डिलीट टाइमर
        if (!activeRooms[data.roomId]) {
            activeRooms[data.roomId] = setTimeout(() => {
                io.to(data.roomId).emit('error-msg', '30 Minutes Over! Connection Closed.');
                delete activeRooms[data.roomId];
            }, 1800000); 
        }
    });

    // एन्क्रिप्टेड मैसेज रिसीव और सेंड करना
    socket.on('send-msg', (data) => {
        // 'data' में अब { roomId, user, text } तीनों होंगे
        io.to(data.roomId).emit('receive-msg', {
            user: data.user,
            text: data.text
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
