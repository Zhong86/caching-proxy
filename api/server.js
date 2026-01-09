const express = require('express'); 
const port = 8000; 
const app = express(); 

app.use(express.json()); 

const dataRouter = require('./routes/dataRoute'); 
app.use('/api', dataRouter); 

app.listen(port, () => {
  console.log('Connected to server on port: ' + port);
}); 
