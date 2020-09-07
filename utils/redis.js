require('dotenv').config();
const redis = require('redis');

const connection_redis = {
  url: process.env.REDIS_URL,
};

const client = redis.createClient(connection_redis);

module.exports = {
  client,
};
