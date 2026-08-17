FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE ${FRONT_PORT}

CMD ["npm", "run", "dev"]
