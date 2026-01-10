#!/usr/bin/env node

const { Command } = require('commander'); 
const program = new Command(); 
const { startProxyServer, clearCache } = require('./server/proxyServer'); 

program 
  .name('cache_proxy')
  .description('CLI to cache data')
  .version('1.0.0'); 

program
  .option('--port <number>', 'Port where caching proxy server will run')
  .option('--origin <url>', 'URL of server to forward req to ')
  .option('--clear-cache', 'Clear Redis cache')
  .action((data) => {
    if (data.clearCache) {
      clearCache(); 
    } else if (data.port && data.origin) {
      startProxyServer(data.port, data.origin); 
    } else {
      console.error('Error: --port and --origin are required'); 
      process.exit(1); 
    }
  }); 

program.parse(); 
