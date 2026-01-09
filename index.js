const commander = require('commander'); 

const program = new Command(); 

program 
  .name('cache_proxy')
  .description('CLI to cache data')
  .version('1.0.0'); 

program
  .command('data')
  .description('Getting info either from cache or server')
  .option('--port <port>', 'Port to send data to')
  .option('--origin <link>', 'Link to send data to')
  .action((data) => {
    if (!data.port || !data.origin) {
      console.error('Error: Port and Origin required'); 
      process.exit(1);
    }
    //GET DATA
  }); 

program
  .command('clear')
  .action(() => clearCache()); 

program.parse(); 
