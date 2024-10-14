# Use the official Node.js image as a base image
FROM node:20-alpine3.18 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3000

FROM node:20-alpine3.18

WORKDIR /app

COPY --from=builder /usr/src/app/dist /app/dist
COPY --from=builder /usr/src/app/prisma /app/prisma
COPY ./scripts/entrypoint.sh /app/entrypoint.sh

# Copy entrypoint script
RUN chmod +x /app/entrypoint.sh

# Start the application
ENTRYPOINT ["/app/entrypoint.sh"]
