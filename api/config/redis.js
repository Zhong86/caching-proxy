const redis = require('redis'); 
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error('Redis client error', err); 
}); 

redisClient.on('connect', () => {
  console.log('Connected to redis'); 
}); 

redisClient.connect().catch(console.error); 
module.exports = redisClient; 
