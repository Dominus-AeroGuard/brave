#!/bin/sh

# Run Prisma migrations
npx prisma migrate deploy

# Run Prisma seeds
npx prisma db seed

# Start the NestJS application
node dist/src/main
