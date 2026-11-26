FROM node:22-bookworm-slim
# Chromium for Kane CLI's local headless browser; fonts so captures render text.
RUN apt-get update && apt-get install -y --no-install-recommends chromium tesseract-ocr fonts-liberation fonts-noto-core ca-certificates git \
  && rm -rf /var/lib/apt/lists/*
RUN npm install -g @testmuai/kane-cli@0.10.9 @anthropic-ai/claude-code
ENV CHROME_PATH=/usr/bin/chromium NODE_ENV=production PORT=3000 CASES_DIR=/data/cases HOME=/root
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["sh", "scripts/start.sh"]
