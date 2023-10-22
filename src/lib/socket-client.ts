import { io } from 'socket.io-client';

export const socket = io();

// // update status when server tells us whether they approve or reject our request to join a room
// socket.on('connection-approve', function (data) {
//     status = "approve";
//     clientData.id = socket.id;
//   })
//   socket.on('connection-reject', function (data) { status = "reject"; })

//   // update our copy everytime the server sends us an update
//   socket.on('server-update', function (data) { serverData = data; })
