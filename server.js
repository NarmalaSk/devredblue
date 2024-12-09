const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://shashinarmala29:LcnEks3kuaQLxgoH@cluster.go8c4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const clickSchema = new mongoose.Schema({
  buttonColor: String,
  timestamp: { type: Date, default: Date.now },
  ipAddress: String,
});

const Click = mongoose.model('Click', clickSchema);

// Rate limiter for Blue Button (max 10 clicks per minute)
const blueLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Blue button rate limit reached. Please try again later.',
});

// Rate limiter for Red Button (max 10 clicks per minute)
const redLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Red button rate limit reached. Please try again later.',
});

// Serve the main page with inline HTML
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rate Limited Button App</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        button { padding: 10px 20px; margin: 10px; font-size: 16px; cursor: pointer; }
        .message { margin-top: 20px; color: red; }
      </style>
    </head>
    <body>
      <h1>Click the buttons below:</h1>
      <button id="blue-button" style="background-color: blue; color: white;">Blue Button</button>
      <button id="red-button" style="background-color: red; color: white;">Red Button</button>
      <p class="message" id="message"></p>

      <script>
        const blueButton = document.getElementById('blue-button');
        const redButton = document.getElementById('red-button');
        const messageElement = document.getElementById('message');

        blueButton.addEventListener('click', async () => {
          try {
            const response = await fetch('/click-blue', { method: 'POST' });
            const message = await response.text();
            if (message.includes('rate limit reached')) {
              alert(message);
            }
            messageElement.textContent = message;
          } catch (err) {
            messageElement.textContent = 'Error: ' + err.message;
          }
        });

        redButton.addEventListener('click', async () => {
          try {
            const response = await fetch('/click-red', { method: 'POST' });
            const message = await response.text();
            if (message.includes('rate limit reached')) {
              alert(message);
            }
            messageElement.textContent = message;
          } catch (err) {
            messageElement.textContent = 'Error: ' + err.message;
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Blue Button Route
app.post('/click-blue', blueLimiter, async (req, res) => {
  const userIP = req.ip || req.connection.remoteAddress;  // Get user IP address
  const click = new Click({
    buttonColor: 'Blue',
    ipAddress: userIP,
  });

  await click.save();  // Save to MongoDB
  res.send('Blue button clicked!');
});

// Red Button Route
app.post('/click-red', redLimiter, async (req, res) => {
  const userIP = req.ip || req.connection.remoteAddress;  // Get user IP address
  const click = new Click({
    buttonColor: 'Red',
    ipAddress: userIP,
  });

  await click.save();  // Save to MongoDB
  res.send('Red button clicked!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
