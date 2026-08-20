const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('redis');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Paste my database URL in the quotes below!
const REDIS_URL = 'rediss://default:gQAAAAAAAmq1AAIgcDFjMTMxYzA4YzBiMWE0NGQwODAzN2M0OGQzMGE5Y2U0NQ@valid-ferret-158389.upstash.io:6379'; 

const redisSubscriber = createClient({ url: REDIS_URL });

redisSubscriber.on('error', (err) => console.log('Redis Error', err));

async function startServer() {
  await redisSubscriber.connect();
  console.log('🚀 Connected to Redis Subscriber!');

  await redisSubscriber.subscribe('system_events', (message) => {
    console.log('📨 New message from Redis:', message);
    io.emit('new_notification', message); 
  });

  io.on('connection', (socket) => {
    console.log('⚡ A user connected:', socket.id);
  });

  server.listen(3000, () => console.log('Socket server running on port 3000'));
}

startServer();

