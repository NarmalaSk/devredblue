const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();
const PORT = 3000;

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || '5432'),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

// Track button clicks
let buttonClicks = {
  red: { count: 0, timestamp: Date.now() },
  blue: { count: 0, timestamp: Date.now() },
};

// Middleware to serve static files (optional, in case you have other static assets)
app.use(express.static('public'));

// API endpoint to handle button clicks
app.post('/click/:color', async (req, res) => {
  const color = req.params.color;
  const currentTime = Date.now();
  const windowSize = 60000; // 1 minute

  // Check for button color and update its count
  if (buttonClicks[color]) {
    if (currentTime - buttonClicks[color].timestamp > windowSize) {
      // Reset counter if outside the time window
      buttonClicks[color] = { count: 1, timestamp: currentTime };
    } else {
      // Increment count within the time window
      buttonClicks[color].count += 1;
    }

    if (buttonClicks[color].count > 10) {
      return res.status(429).json({ message: 'Click limit exceeded!' });
    }
  } else {
    // Initialize tracking for new buttons
    buttonClicks[color] = { count: 1, timestamp: currentTime };
  }

  res.status(200).json({ message: 'Click registered!' });
});

// Route to display the HTML with inline JavaScript for buttons
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Button Click Limit</title>
      <style>
        .button {
          padding: 10px 20px;
          margin: 10px;
          font-size: 16px;
          cursor: pointer;
        }
        #red-button {
          background-color: red;
          color: white;
        }
        #blue-button {
          background-color: blue;
          color: white;
        }
        #alert {
          margin-top: 20px;
          color: red;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <button id="red-button" class="button">Red Button</button>
      <button id="blue-button" class="button">Blue Button</button>
      <div id="alert"></div>

      <script>
        async function handleClick(color) {
          try {
            const response = await fetch('/click/' + color, { method: 'POST' });
            const data = await response.json();
            if (!response.ok) {
              document.getElementById('alert').innerText = data.message;
            } else {
              document.getElementById('alert').innerText = '';
            }
          } catch (error) {
            console.error('Error:', error);
          }
        }

        document.getElementById('red-button').onclick = () => handleClick('red');
        document.getElementById('blue-button').onclick = () => handleClick('blue');
      </script>
    </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
