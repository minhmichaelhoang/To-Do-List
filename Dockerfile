FROM node:22-alpine

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build --workspace=backend

EXPOSE 3000

CMD ["node", "backend/dist/Server.js"]
