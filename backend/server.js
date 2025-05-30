const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { connectMongo } = require("./db/mongo");
const notificationRoutes = require("./routes/notifications");
const { setupSocket, emitNotification } = require("./socket");
const Redis = require("ioredis");

const sub = new Redis(process.env.REDIS_URI);
const redis = new Redis(process.env.REDIS_URI, {
  maxRetriesPerRequest: null,
  tls: {},
});

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

connectMongo();
setupSocket(io);

app.use(cors());
app.use(express.json());
app.use("/notifications", notificationRoutes);

sub.subscribe("notifications", (err, count) => {
  if (err) {
    console.error("Failed to subscribe:", err);
  } else {
    console.log("Subscribed to notifications channel");
  }
});

sub.on("message", (channel, message) => {
  if (channel === "notifications") {
    const { userId, notification } = JSON.parse(message);
    emitNotification(userId, notification);
  }
});

app.post('/like', async (req, res) => {
  const { from_user, to_user, post_id } = req.body;
  const queue = require('./queue/queue');
  const redisKey = `likes:${to_user}:${post_id}`;
  const batchJobId = redisKey + ':batch';

  // Add like to Redis Set
  await redis.sadd(redisKey, from_user);

  // Check if job already exists (i.e., currently batching)
  const jobExists = await queue.getJob(batchJobId);

  if (!jobExists) {
    await queue.add(
      'batch-like',
      { to_user, post_id },
      {
        jobId: batchJobId,
        delay: 10000,
      }
    );

    console.log(`[LIKE] Queued batch job for ${redisKey}`);
  }

  res.status(200).send({ status: 'Like added to Redis set' });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
