const http = require('http');
const PORT = require('PORT');
// Create an HTTP server and listen on port 3000
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

// Listen on port 3000
server.listen($PORT, () => {
  console.log('Server running at http://localhost:PORT/');
});
