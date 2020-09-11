FROM node:10
WORKDIR /usr/src/app
COPY . .
COPY package.json ./
RUN npm install
RUN npm install pm2 -g
RUN npm run build
COPY ./dist .
EXPOSE 5000
EXPOSE 5432
EXPOSE 6379
CMD ["pm2-runtime","app.js"]