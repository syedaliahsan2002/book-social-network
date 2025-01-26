# Stage 1: Build Angular App
FROM node:20.16.0-alpine AS build-stage

WORKDIR /app

# Copy package.json and package-lock.json separately for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Run Angular Compilation with Ivy
RUN npx ngcc --production es2023 browser module main --first-only -create-ivy-entry-points

# Copy all source files
COPY . .

# Build Angular production files
RUN npm run build --production

# Stage 2: Serve with Nginx
FROM nginx:stable

# Copy built Angular files from previous stage
COPY --from=build-stage /app/dist/book-network-ui/browser/ /usr/share/nginx/html

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80
