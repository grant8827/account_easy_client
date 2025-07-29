FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY craco.config.js ./

# Install dependencies
RUN npm install
RUN npm install -g serve

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Set environment variable for the port
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the app using serve
CMD ["npm", "run", "serve"]
