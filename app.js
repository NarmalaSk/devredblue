const express = require('express');
const { PubSub } = require('@google-cloud/pubsub');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Google Cloud Pub/Sub setup
const pubSubClient = new PubSub();
const topicName = 'projects/YOUR_PROJECT_ID/topics/YOUR_TOPIC_NAME'; // Replace with your Google Cloud project and topic

// Store button clicks and related data
const buttonClicks = {
  red: [],
  blue: [],
};

// Helper function to reset clicks after a minute
function resetClicks() {
  const currentTime = Date.now();
  for (let color in buttonClicks) {
    // Keep only clicks within the last 1 minute
    buttonClicks[color] = buttonClicks[color].filter(click => currentTime - click.timestamp < 60000);
  }
}

// API endpoint to handle button clicks
app.post('/click/:color', (req, res) => {
  const color = req.params.color;
  const ip = req.ip;
  const currentTime = Date.now();
  const maxClicks = 10;

  // Reset clicks every minute
  resetClicks();

  if (buttonClicks[color].length >= maxClicks) {
    return res.status(429).json({ message: `Click limit exceeded for the ${color} button!` });
  }

  // Store click data (timestamp, button color, IP address)
  buttonClicks[color].push({ timestamp: currentTime, color, ip });

  // If 10 clicks have been reached, generate a new endpoint
  if (buttonClicks[color].length === maxClicks) {
    createPubSubEndpoint(color);
  }

  res.status(200).json({ message: `Click registered for the ${color} button!` });
});

// Helper function to create the endpoint and publish a message to Pub/Sub
async function createPubSubEndpoint(color) {
  const endpoint = `/pubsub/${color}`;

  // Create the new endpoint that will publish the message to Pub/Sub
  app.post(endpoint, async (req, res) => {
    const message = {
      buttonColor: color,
      timestamp: Date.now(),
      message: `Button ${color} reached 10 clicks.`,
    };

    try {
      // Publish message to Google Cloud Pub/Sub
      const dataBuffer = Buffer.from(JSON.stringify(message));
      await pubSubClient.topic(topicName).publish(dataBuffer);

      res.status(200).json({ message: `Message published to Pub/Sub for ${color} button.` });
    } catch (error) {
      console.error('Error publishing to Pub/Sub:', error);
      res.status(500).json({ message: 'Error publishing to Pub/Sub' });
    }
  });

  console.log(`Created new endpoint: ${endpoint}`);
}

// Serve the HTML page with buttons
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
