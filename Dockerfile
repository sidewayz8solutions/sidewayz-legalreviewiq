# Stage 1: Install dependencies and build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY . .

# Build Next.js application
RUN npm run build

# Stage 2: Set up the production environment
FROM node:20-alpine AS runner

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Set working directory
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=appuser:appgroup /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port 3000 (default Next.js port)
EXPOSE 3000

# Set environment variables required for Supabase (replace placeholders)
ENV NEXT_PUBLIC_SUPABASE_URL="https://qunaiicjcelvdunluwqh.supabase.co"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bmFpaWNqY2VsdmR1bmx1d3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NjA4NjEsImV4cCI6MjA2OTMzNjg2MX0.rFXwY95lvcXZEds7f16KodwhfnGHQBp7GsV4WTFQHjI"
ENV SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# Start Next.js application
CMD ["npm", "start"]

