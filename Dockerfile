# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Create a non-root user for better security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --force

# Copy source code with proper ownership
COPY --chown=nodejs:nodejs . .

# Change ownership of the working directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port 5173 (Vite default)
EXPOSE 5173

# Start development server with host binding for Docker
CMD ["npm", "run", "dev-host"] 