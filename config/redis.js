const redis = require('redis'); 

const redisClient = redis.createClient({
  host: 'localhost', 
  port: 2000
}); 

redisClient.on('error', (err) => {
  console.error('Failed to connect to Redis', err.message); 
}); 

redisClient.on('connect', () => {
  console.log('Connected to redis'); 
}); 

redisClient.connect().catch(console.error); 

module.exports = redisClient; 
