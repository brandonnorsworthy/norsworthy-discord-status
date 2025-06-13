# Use a stable Node.js base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install --production

# Copy the rest of the app
COPY . .

# Expose the port
EXPOSE 3000

# Default command
CMD ["npm", "start"]
