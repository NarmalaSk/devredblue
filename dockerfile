# Use the official Node.js Alpine image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Clear npm cache to prevent EINTEGRITY errors
RUN npm cache clean --force

# Install the latest npm version
RUN npm install -g npm@latest

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the app will run on
EXPOSE 8080

# Command to start the app
CMD ["node", "app.js"]
