// server.js
const express = require('express');
const WebSocket = require('ws')
const SocketServer = require('ws').Server;
const uuid = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

wss.broadcast = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN){
      client.send(JSON.stringify(message));
    }
  })
}

let users = 0

wss.on('connection', (ws) => {
  console.log('Client Connected')
  users++;
  userCount = {
    users: users,
    type: 'userCount'
  }
  wss.broadcast(userCount);

  ws.on('message', (data) => {
    dataJSON = JSON.parse(data);
    dataJSON.id = uuid();

    switch(dataJSON.type){
      case 'postMessage':
        let newMessage = {
          type: 'incomingMessage',
          username: dataJSON.username,
          content: dataJSON.content,
          id: dataJSON.id
        }
        wss.broadcast(newMessage);
        break;
      case 'postNotification':
        let newUsername = {
          type: 'incomingNotification',
          oldName: dataJSON.oldName,
          newName: dataJSON.newName,
          id: dataJSON.id
        }
        wss.broadcast(newUsername);
    }
  })
  // Set up a callback for when a client closes the socket. This usually means they closed their browser. 
  ws.on('close', () => console.log('Client disconnected'));
});
