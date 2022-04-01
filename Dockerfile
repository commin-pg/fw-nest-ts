
FROM node:16.4.2-alpine3.11
RUN mkdir -p /home/app

WORKDIR /home/app
## Step 1의 builder에서 build된 프로젝트를 가져온다


RUN npm install
RUN npm run build

COPY . .

EXPOSE 3000

CMD npm run start:dev
