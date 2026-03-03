# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm install instead of npm ci for flexibility)
RUN npm install --omit=dev

# Copy source code
COPY src ./src

# Expose WebSocket port
EXPOSE 3001

# Start server
CMD ["npm", "start"]
