async function getData(port, origin) {
  const url = 'http://localhost:8000/api/data'; 
  try {
    const response = await fetch(url, {method: 'GET'}); 
    const result = await response.json(); 

    if (!response.ok) {
      return console.log('Error in fetch: ' + result); 
    } 
    
    console.log('Result: ', JSON.stringify(result, null, 2)); 
  } catch (error) {
    console.error('Error in data fetch: ', error.message ); 
  } finally {
    process.exit(0); 
  }
}

async function clearCache() {
  try {
    console.log('Clearning cache'); 
  } catch (error) {
    console.error('Error in clearing cache: ', error.message); 
  }finally {
    process.exit(0); 
  }
}

module.exports = { getData, clearCache };
