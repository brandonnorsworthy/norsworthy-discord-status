FROM node:18-slim

# Install system dependencies needed by Playwright
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libnss3 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libxss1 \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils \
    ca-certificates \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Install Playwright browsers
RUN npx playwright install --with-deps

EXPOSE 3500
CMD ["npm", "start"]
