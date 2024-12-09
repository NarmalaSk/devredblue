# Use the official Node.js Alpine image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code (ensure index.js is present in this directory)
COPY . .

# Verify that the index.js file is copied
RUN ls -l /app

# Expose the port that the app will run on
EXPOSE 8080

# Command to start the app
CMD ["node", "index.js"]
