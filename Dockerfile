# Use an official Node runtime as the parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Build the Tailwind CSS
RUN npm run build:css

# Make port 17432 available to the world outside this container
EXPOSE 17432

# Define environment variable
ENV NODE_ENV=production

# Run the app when the container launches
CMD ["node", "server.js"]