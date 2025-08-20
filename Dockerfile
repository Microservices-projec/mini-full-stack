FROM node

WORKDIR /myapp

COPY . .

RUN npm init -y
RUN npm install express mysql2 body-parser cors

CMD [ "node","server.js" ]
