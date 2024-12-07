FROM node:22

WORKDIR /app 

COPY package.json /app

RUN npm install

RUN npm install nodemon -g

COPY . /app

CMD ["npm", "start"]



