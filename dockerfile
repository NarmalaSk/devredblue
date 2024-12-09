# Use a lightweight Node.js image as the base
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code (including the public folder)
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Start the app
CMD [ "node", "app.js" ]

# Environment variable for Google Cloud project ID (optional)
ENV GOOGLE_CLOUD_PROJECT  # Replace with your project ID

# Environment variable for Google Cloud Pub/Sub topic name (optional)
ENV PUBSUB_TOPIC  # Replace with your topic name