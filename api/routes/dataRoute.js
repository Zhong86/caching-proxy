const express = require('express'); 
const router = express.Router();
const pool = require('../config/database'); 
const redisClient = require('../config/redis'); 

const DEFAULT_EXPIRATION = 60; 

router.get('/data', async (req, res) => {
  try {
    //REDIS 
    const cachedData = await redisClient.get('data'); 

    if (cachedData != null) {
      console.log('Cache HIT'); 
      return res.status(200).json(JSON.parse(cachedData)); 
    } else {
      console.log('Cache MISS'); 
      const [rows] = await pool.query(
        'SELECT * FROM datas'
      ); 

      if (!rows || rows.length === 0) {
        res.status(404).json({ message: 'No data in db' }); 
      }

      await redisClient.setEx('data', DEFAULT_EXPIRATION, JSON.stringify(rows));
      res.status(200).json(rows); 
    }
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
}); 

module.exports = router; 
