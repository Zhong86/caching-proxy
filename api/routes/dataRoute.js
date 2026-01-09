const express = require('express'); 
const router = express.Router();
const pool = require('../config/database'); 
const redis = require('redis'): 

const redisClient = redis.createClient(); 
const DEFAULT_EXPIRATION = 10; 

router.get('/data', async (req, res) => {
  try {
    //REDIS 
    redisClient.get('data', async (error, data) => {
      if (error) console.error(error); 
      if (photos != null) {
        console.log('Cache HIT'); 
        return res.status(200).json(JSON.parse(photos)); 
      } else {
        console.log('Cache MISS'); 
        const [rows] = await pool.query({
          'SELECT * FROM caching-proxy-db'
        }); 

        if (!rows || rows.length === 0) {
          res.status(404).json({ message: 'No data in db' }); 
        }

        redisClient.setex('data', DEFAULT_EXPIRATION, JSON.stringify(rows));
        res.status(200).json(rows); 
      }
    }); 
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
}); 

module.exports = router; 
