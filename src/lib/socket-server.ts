import type { ItemProps, PlayerProps } from '$lib';
import { Server } from 'socket.io';
import type { ViteDevServer } from 'vite';

const MAX_PLAYERS = 20;
const MAX_ITEMS = 5000;

interface ServerState {
	players: { [id: string]: PlayerProps };
	items: { [id: string]: ItemProps };
}

export const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		let numPlayers = 0;
		let serverData: ServerState = {
			players: {},
			items: {}
		};

		io.on('connection', (socket) => {
			console.log('new connection: ' + socket.id);

			if (numPlayers >= MAX_PLAYERS) {
				socket.emit('connection-reject');
				return;
			} else {
				numPlayers++;
				socket.emit('connection-approve');
			}

			socket.on('client-update', function (data) {
				serverData.players[socket.id] = data;
				console.log(serverData);
			});

			let timer = setInterval(function () {
				var others: ServerState = {
					players: {},
					items: {}
				};
				for (var k in serverData) {
					if (k != socket.id) {
						others.players[k] = serverData.players[k];
					}
				}
				socket.emit('server-update', serverData);
			}, 15);

			//   // the client disconnected, let's wipe up after them
			socket.on('disconnect', function () {
				clearInterval(timer); // cancel the scheduled updates we set up earlier
				delete serverData.players[socket.id];
				console.log(socket.id + ' disconnected');
				numPlayers--;
			});
		});
	}
};
