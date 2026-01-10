const mysql = require('mysql2/promise'); 

const pool = mysql.createPool({
  host: 'localhost', 
  user: 'root', 
  password: 'Zhong@sql', 
  database: 'caching_proxy', 
  waitForConnections: true, 
  connectionLimit: 10, 
  queueLimit: 0
}); 

pool.getConnection()
  .then(connection => {
    console.log('Connected to db'); 
    connection.release(); 
  })
  .catch(err => {
    console.error('Failed to connect to db: ' + err.message); 
  }); 

module.exports = pool; 
