const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', (req, res) => {
 res.send('<p>hello</p>');
});

let clients = [];

io.on('connection', (socket) => {
  clients.push(socket);
  console.log('a user connected');

  socket.on('new_message', (data) => {
    socket.emit('message', data);
  });
});

http.listen(3000, () => {
 console.log('listening on 3000');
});
