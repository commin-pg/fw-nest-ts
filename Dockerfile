FROM node:12
WORKDIR /usr/src/fms
COPY package.json .
RUN npm install
COPY . .

RUN npm run --script build
CMD node dist/main.js
    