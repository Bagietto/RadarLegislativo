FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY apps/frontend/package.json ./apps/frontend/package.json

RUN npm install

COPY . .

EXPOSE 4200

CMD ["npm", "run", "start", "-w", "apps/frontend", "--", "--host", "0.0.0.0"]
