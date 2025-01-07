# PRIMERA ETAPA
FROM node:20-alpine3.20 AS builder
RUN npm install -g pnpm

WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .

# SEGUNDA ETAPA
FROM node:20-alpine3.20 as produccion

WORKDIR /app

COPY --chown=node:node --from=builder /app . 
USER node

# Para producción
CMD ["node", "src/index.js"]

# Para desarrollo
#CMD ["npm", "run", "dev"]
