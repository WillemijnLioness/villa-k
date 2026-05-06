FROM node:20-alpine

WORKDIR /app

# sharp ships prebuilt binaries for linux-x64-musl (Alpine) — no build tools needed
COPY package.json .
RUN npm install --production

COPY server/ ./server/
COPY public/ ./public/
COPY admin.html .

# Ensure runtime directories exist; DATA_DIR volume takes over in Railway
RUN mkdir -p server/data public/uploads tmp \
    && echo '{}' > server/data/overrides.json

EXPOSE 3000
CMD ["node", "server/index.js"]
