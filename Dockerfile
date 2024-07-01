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

# Variáveis de ambiente (opcionalmente, podem ser definidas em tempo de execução ou em um arquivo .env)
ENV NODE_ENV=development \
    DATABASE_URL=postgresql://postgres:2xoO0RCZYxYVuhm0McnY@aeroguard.c3qi2qyu270f.us-east-1.rds.amazonaws.com:5432/aeroguard \
    AWS_ACCESS_KEY=AKIAZQ3DQWUEQJAYLIFS \
    AWS_SECRET=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 \
    AWS_BUCKET_NAME_RA=aeroguard-ra \
    AWS_BUCKET_NAME_RO=aeroguard-ro \
    AWS_BUCKET_NAME_KML=aeroguard-kml \
    AWS_REGION=us-east-1

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
