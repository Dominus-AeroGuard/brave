# Use the official Node.js image as a base image
FROM node:20

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

# Copy entrypoint script
COPY ./scripts/entrypoint.sh /usr/src/app/entrypoint.sh

RUN chmod +x /usr/src/app/entrypoint.sh

# Expose the application port
EXPOSE 3000

# Start the application
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
