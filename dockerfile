# Use the official Node.js image with Alpine
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app code into the container
COPY . .

# Expose the port the app will listen on
EXPOSE 8080

# Start the app using Node.js directly
CMD ["node", "index.js"]
