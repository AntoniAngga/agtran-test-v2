// require('dotenv').config();
// const redis = require('../utils/redis');

// // const connection_redis = {
// //   url: process.env.REDIS_URL || '',
// // };

// exports.check_redis = async (req, res, next) => {
//   const client = redis.createClient({});
//   client.on('error', function (error) {
//     console.log(error);
//     if (error) {
//       console.error(error);
//       res.status(500).send(error);
//     } else {
//       console.log('using Redis, and not Error');
//       next();
//     }
//   });
// };
