import type { Item, Player } from '$lib';
import { Server } from 'socket.io';
import type { ViteDevServer } from 'vite';

const MAX_PLAYERS = 20;
const MAX_ITEMS = 5000;

interface ServerState {
	players: { [id: string]: Player };
	items: { [id: string]: Item };
}

export const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		let serverData: any = {};

		io.on('connection', (socket) => {
			socket.emit('eventFromServer', 'Hello, World 👋');

			// // "socket" now refers to this particular new player's connection

			console.log('new connection: ' + socket.id);

			// // if there're too many players, reject player's request to join
			// if (numPlayers >= MAX_PLAYERS) {
			// 	socket.emit('connection-reject');
			// 	return;
			// }
			// numPlayers++;

			// // ok you're in
			// socket.emit('connection-approve');

			socket.on('eventFromClient', (e) => console.log('from client', e));

			// what to do when client sends us a message titled 'client-update'
			socket.on('client-update', function (data) {
				serverData[socket.id] = data;
				console.log(serverData);
			});

			// // every couple milliseconds we send to this client
			// // the data of everybody else

			// // setInterval(f,t) = run function f every t milliseconds

			// let timer = setInterval(function () {
			// 	var others = {};
			// 	for (var k in serverData) {
			// 		if (k != socket.id) {
			// 			others[k] = serverData[k];
			// 		}
			// 	}
			// 	socket.emit('server-update', serverData);
			// }, 15);

			// //   // the client disconnected, let's wipe up after them
			// socket.on('disconnect', function () {
			// 	clearInterval(timer); // cancel the scheduled updates we set up earlier
			// 	delete serverData[socket.id];
			// 	console.log(socket.id + ' disconnected');
			// 	numPlayers--;
			// });
		});
	}
};
