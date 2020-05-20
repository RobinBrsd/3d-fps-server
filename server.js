const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('user connection !');

    socket.on('joinRoom', (room) => {
        if (io.sockets.adapter.rooms[room]) {
            if (io.sockets.adapter.rooms[room].length >= 2) {
                socket.emit('errorFull', 'Room is full');
            } else {
                socket.join(room);
                io.in(room).emit('joinedRoom', 'J2');
            }
        } else {
            socket.join(room);
            io.in(room).emit('joinedRoom', 'J1');
        }
    });

    socket.on('messageSend', (room, msg, player) => {
        io.in(room).emit('messageReceive', msg, player);
    });

    socket.on('ready', (room, player) => {
        io.in(room).emit('readyPlayer', player);
    });

    // Step 2 game socket
    socket.on('joinRoomGame', (room, player) => {
        if (io.sockets.adapter.rooms[room]) {
            if (io.sockets.adapter.rooms[room].length >= 2) {
                socket.emit('errorFull', 'Room is full');
            } else {
                socket.join(room);
                io.in(room).emit('joinedRoomGame', player);
            }
        } else {
            socket.join(room);
            io.in(room).emit('joinedRoomGame', player);
        }
    });

    socket.on('shoot', (room, bullet) => {
        io.in(room).emit('getBullet', bullet);
    });

    socket.on('hit', (room, player) => {
        io.in(room).emit('hited', player);
    });

    socket.on('playerDie', (room, player) => {
        io.in(room).emit('playerDied', player);
    });

    socket.on('playerMove', (room, player, positions) => {
        io.in(room).emit('playerMoved', player, positions);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected !');
    });
});

http.listen(7777, () => {
    console.log('Server Running On Port : 7777');
});
