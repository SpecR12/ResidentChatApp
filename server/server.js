const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const USERS_FILE = path.join(__dirname, 'users.json');
const BLOCK_CODE = "test1234";

const getUsers = () => {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]');
    return [];
  }
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  console.log('Users saved:', users.length);
};

// --- API ---

app.post('/api/check-code', (req, res) => {
  if (req.body.code === BLOCK_CODE) res.json({ success: true });
  else res.status(401).json({ success: false });
});

app.post('/api/login', (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.email === req.body.email && u.password === req.body.password);

  if (user) {
    console.log('Login success:', user.username);
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false });
  }
});

app.post('/api/register', (req, res) => {
  const users = getUsers();

  if (users.find(u => u.email === req.body.email)) {
    return res.status(400).json({ success: false, message: 'Email existent' });
  }

  const newUser = {
    id: uuidv4(),
    ...req.body,
    avatarColor: '#' + Math.floor(Math.random()*16777215).toString(16)
  };

  users.push(newUser);
  saveUsers(users);

  res.json({ success: true, user: newUser });
});

// --- SOCKET ---
let history = [];

io.on('connection', (socket) => {
  socket.emit('history', history);

  socket.on('join', (user) => {
      const systemMsg = {
        id : uuidv4(),
        type: 'SYSTEM',
        content: `Salut, @${user.username}. Bine ai venit pe ResidentLive!`,
        timestamp: new Date()
      };
      history.push(systemMsg);
      if(history.length > 50) history.shift();
      io.emit('newMessage', systemMsg);
  });

  socket.on('sendMessage', (msg) => {
    const fullMsg = { ...msg, timestamp: new Date() };
    history.push(fullMsg);
    if(history.length > 50) history.shift();
    io.emit('newMessage', fullMsg);
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
