const { log } = require('console');
const http=require('http');

const fs=require('fs');

const routes= require('./routes')

console.log("Starting Server");

const server=http.createServer(routes.handler);
server.listen(3739);