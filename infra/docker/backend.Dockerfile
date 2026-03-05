FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm install

COPY . .

RUN npm run build -w apps/backend

EXPOSE 3000

CMD ["npm", "run", "start", "-w", "apps/backend"]
