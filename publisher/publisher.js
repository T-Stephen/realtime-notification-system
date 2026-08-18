const { createClient } = require('redis');

// We will replace this with your actual Upstash Connection URL
const REDIS_URL = 'rediss://default:gQAAAAAAAmq1AAIgcDFjMTMxYzA4YzBiMWE0NGQwODAzN2M0OGQzMGE5Y2U0NQ@valid-ferret-158389.upstash.io:6379';

const client = createClient({
  url: REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

async function startPublisher() {
  await client.connect();
  console.log('🚀 Connected to Redis successfully!');

  let counter = 1;

  // This simulates the backend sending a new notification every 5 seconds
  setInterval(async () => {
    const notification = JSON.stringify({
      id: counter,
      message: `System Alert: New event triggered! (#${counter})`,
      time: new Date().toLocaleTimeString()
    });

    await client.publish('notifications_channel', notification);
    console.log(`[Published] -> ${notification}`);
    counter++;
  }, 5000);
}

startPublisher();