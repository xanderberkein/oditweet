const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { v4: uuid } = require('uuid');

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const oditweets = [];

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

app.get('/oditweets', (req, res) => {
  res.json({ oditweets });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('oditweet', (oditweet) => {
    console.log('msg', oditweet);
    if (oditweet.content) {
      const newOditweet = {
        id: uuid(),
        ...oditweet,
      };
      io.emit('oditweet', newOditweet);
      oditweets.push(newOditweet);
    }
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
