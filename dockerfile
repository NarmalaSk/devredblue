# Use an official Node.js runtime as a parent image (Alpine version)
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json into the container
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the app files into the container
COPY . .

# Make the app available on port 3000
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
