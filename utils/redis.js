require('dotenv').config();
const Redis = require('ioredis');

const url = process.env.REDIS_URL || '';

const client = new Redis(url);

module.exports = {
  client,
};
