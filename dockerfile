# Use the official Node.js Alpine image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Update npm to the latest version
RUN npm install -g npm@10.9.2

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Verify that the index.js file is copied
RUN ls -l /app

# Expose the port that the app will run on
EXPOSE 8080

# Command to start the app
CMD ["node", "app.js"]
