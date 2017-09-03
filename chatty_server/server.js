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

    switch(dataJSON.type){
      case 'postMessage':
        // ws.name = dataJSON.username;
        broadcastMessage(newMessage(dataJSON));
        break;
      case 'postNotification':
        // ws.name = dataJSON.username;
        broadcastMessage(postNotification(dataJSON));
    }

    function newMessage(message){
      let newMessage = {
        type: 'incomingMessage',
        data: {
          username: message.data.username,
          content: message.data.content,
          id: uuid()
        }
      }
      return newMessage
    }

    function postNotification(message){
      let newUsername = {
        type: 'incomingNotification',
        data: {
          content: message.data.oldName + " has changed their name to " + message.data.newName
        }
      }
      return newUsername
    }

  })
  // Set up a callback for when a client closes the socket. This usually means they closed their browser. 
  ws.on('close', () => {
    users--;
    console.log('Client disconnected')
  });
});

broadcastMessage = (message) => {
    wss.clients.forEach((client) => {
        if (client.readyState === require('ws').OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};