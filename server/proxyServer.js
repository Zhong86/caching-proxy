const express = require('express'); 
const redisClient = require('../config/redis'); 

const DEFAULT_EXPIRATION = 60; 

async function startProxyServer(port, origin) {
  const app = express(); 

  const originUrl = origin.replace(/\/$/, ''); //removes trailing slash

  console.log('Starting caching proxy server'); 
  console.log(`Port: ${port}, Origin: ${originUrl}`);
  
  //get any origin
  app.use(async (req, res) => {
    try {
      const reqPath = req.originalUrl;
      const cacheKey = `cache:${reqPath}`; 

      console.log(`\n-> Request: ${reqPath}`); 

      const cachedResponse = await redisClient.get(cacheKey); 

      if (cachedResponse) {
        console.log('Cache HIT'); 
        const cached = JSON.parse(cachedResponse); 
        
        //set cache header
        res.set('X-Cache', 'HIT'); 
        
        //set original headers
        Object.keys(cached.headers).forEach(key => {
          res.set(key, cached.headers[key]); 
        });

        return res.status(cached.status).send(cached.data); 
      }

      console.log('Cache MISS'); 

      const targetUrl = `${originUrl}${reqPath}`;
      const response = await fetch(targetUrl, {
        method: req.method, 
        headers: {
          ...req.headers, 
          host: new URL(originUrl).host //update host header
        }
      });

      const data = await response.text(); 

      //get response headers
      const responseHeaders = {}; 
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value; 
      });

      const cacheData = {
        status: response.status, 
        headers: responseHeaders, 
        data: data
      }; 

      await redisClient.setEx(
        cacheKey, DEFAULT_EXPIRATION, JSON.stringify(cacheData)
      ); 

      res.set('X-Cache', 'MISS'); 
      Object.keys(responseHeaders).forEach(key => {
        res.set(key, responseHeaders[key]); 
      });

      res.status(response.status).send(data); 
    } catch (error) {
      console.error('Proxy error: ', error.message); 
      res.status(500).json({message: error.message}); 
    }
  }); 

  app.listen(port, () => {
    console.log('Proxy server running'); 
  }); 
}

async function clearCache() {
  try {
    await redisClient.flushAll(); 
    console.log('Cleared cache');
    process.exit(0); 
  } catch (error) {
    console.error('Error clearing cache: ', error.message); 
    process.exit(1); 
  }
}

module.exports = { startProxyServer, clearCache }; 
