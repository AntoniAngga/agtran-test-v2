require('dotenv').config();
const Redis = require('ioredis');

// const connection_redis = {
//   url: process.env.REDIS_URL,
// };
const url = process.env.REDIS_URL || '';

const client = new Redis(url);

module.exports = {
  client,
};
