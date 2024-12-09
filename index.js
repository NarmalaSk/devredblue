const http = require('http');

// Get the port from the environment variable or default to 8080
const PORT = process.env.PORT || 8080;

// Create an HTTP server and listen on the dynamically assigned port
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

// Listen on the dynamic port
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
