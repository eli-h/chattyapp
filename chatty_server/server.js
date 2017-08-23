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
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client Connected')
  ws.on('message', (data) => {
    dataJSON = JSON.parse(data);
    switch(dataJSON.type){
      case 'postMessage':
        console.log(dataJSON)
        dataJSON.id = uuid();
        dataJSON.type = 'incomingMessage'
        wss.clients.forEach((client) => {
          if (client !== ws || client.readyState === WebSocket.OPEN){
            client.send(JSON.stringify(dataJSON));
          }
        })
        break;
      case 'postNotification':
        console.log(dataJSON)
        dataJSON.type = 'incomingNotification'
        wss.clients.forEach((client) => {
          if (client !== ws || client.readyState === WebSocket.OPEN){
            client.send(JSON.stringify(dataJSON));
          }
        })
    }
  })
  // Set up a callback for when a client closes the socket. This usually means they closed their browser. 
  ws.on('close', () => console.log('Client disconnected'));
});

// wss.broadcast = function(data) {
// 	wss.clients.forEach(function(client)) {
// 		if (client.readyState === client.OPEN) {
// 			client.send(data)
// 		}
// 	}


// function clientConnected(client, clientId){
// 	client[clientId] = {
// 		id: clientId,
// 		name:, 
// 		content:
// 	}
// }

// 	const setupMsg = {
// 		type: 'setup',
// 		data: {
// 			id: clientId,
// 			connectedClients: clients
// 		}
// 	}

// 	const connectionMsg = {
// 		type: 'connection',
// 		data: clients[clientId]
// 	}

//   if (client.readyState === client.OPEN) {
//     client.send(JSON.stringify(setupMsg))
//   }
//   wss.broadcast(JSON.stringify(connectionMsg))
//   console.log(`>> ${clients[clientId].name}`, clients[clientId])
// }

// function clientDisconected(clientId) {
//   const client = clients[clientId]

//   if (!client) return // catch race condition

//   const disconnectionMsg = {
//     type: 'disconnection',
//     data: client
//   }
//   wss.broadcast(JSON.stringify(disconnectionMsg))
//   console.log(`<< ${client.name} (${clientId}) disconnected`)
//   delete clients[clientId]
// }

// function handleMessage(incoming) {
//   // Broadcast message back no matter what
//   wss.broadcast(incoming)

//   var message = JSON.parse(incoming)

//   switch(message.type) {
//     case 'action':
//       // Update client state based on id
//       clients[message.data.id] = clients[message.data]
//       break

//     default:
//       console.log(`Unsupported message:`, message)
//   }
// }