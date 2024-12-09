const http = require('http');

// Read the greeting message from the environment variable or default to 'Hello, World!'
const greeting = process.env.GREETING || 'Hello, World!';

// Get the port from the environment variable or default to 8080
const PORT = process.env.PORT || 8080;

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(greeting);
});

// Listen on the specified port
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
