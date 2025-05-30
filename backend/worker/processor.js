const { Worker } = require("bullmq");
const Redis = require("ioredis");
const { Notification } = require("../db/mongo");
const { connectMongo } = require("../db/mongo");
const { emitNotification } = require("../socket");

require("dotenv").config();

connectMongo();

const redisConnection = new Redis(process.env.REDIS_URI, {
  maxRetriesPerRequest: null,
  tls: {},
});

redisConnection.on("connect", () => console.log("Redis connected (worker)"));
redisConnection.on("error", (err) =>
  console.error("Redis error (worker):", err)
);

console.log("Worker started and listening for jobs...");

const processJob = async (job) => {
  if (job.name === "batch-like") {
    const { to_user, post_id } = job.data;
    const redisKey = `likes:${to_user}:${post_id}`;

    const fromUsers = await redisConnection.smembers(redisKey);
    console.log(`Processing job for post ${post_id} liked by:`, fromUsers);
    if (!fromUsers.length) return;

    const message = formatGroupedMessage(fromUsers, post_id);

    const notif = new Notification({
      user_id: to_user,
      message,
      post_id,
      timestamp: Date.now(),
      read: false,
    });

    const notifData = await notif.save();

    redisConnection.publish(
      "notifications",
      JSON.stringify({
        userId: to_user,
        notification: notifData,
      })
    );

    await redisConnection.del(redisKey);
  }
};

const worker = new Worker("notifications", processJob, {
  connection: redisConnection,
});

function formatGroupedMessage(users, post_id) {
  if (users.length === 1) return `${users[0]} liked your post (${post_id})`;
  if (users.length === 2)
    return `${users[0]} and ${users[1]} liked your post (${post_id})`;
  return `${users.slice(0, 2).join(", ")} and ${
    users.length - 2
  } others liked your post (${post_id})`;
}

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});
