const express = require('express');
const app = express();
const {createServer} = require('node:http');
const {Server} = require('socket.io');

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});
let chatUsers = [];
let photoUsers = [];
io.on ('connection', (socket) => {
    console.log('a user connected');

    socket.on('setUsername', username => {
        chatUsers.push({
            username, id:socket.id
        })
    })
    socket.on('setPhoto', photo => {
        photoUsers.push({
            photo, id:socket.id
        })
    })
    socket.on('userMessage', msg => {
        const findUser = chatUsers.find(user => user.id === socket.id);
        io.emit('message', {...msg, username: findUser.username});
    })
    socket.on('selectedBox', selectedBox => {
        const userToFind = photoUsers.find(user => user.id === socket.id);

        io.emit('showPhoto', {selectedBox, photo: userToFind.photo})
    })
});
server.listen(3001,() => {
    console.log('server running on http://localhost:3001');
})