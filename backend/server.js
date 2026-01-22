const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reports', require('./routes/reports'));

// Real-time stock updates
io.on('connection', (socket) => {
  socket.on('updateStock', (data) => {
    io.emit('stockUpdated', data);
  });
});

// Scheduled reports (e.g., email daily reports)
cron.schedule('0 9 * * *', async () => {
  // Code to generate and email reports using nodemailer
  console.log('Sending scheduled report...');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));