const { Queue } = require('bullmq');
const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis(process.env.REDIS_URI,{
    maxRetriesPerRequest: null, 
    tls: {},
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err));

const queue = new Queue('notifications', { connection: redis });

module.exports = queue;