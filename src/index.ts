import { createApplicationCommandHandler, Command } from './http-interactions';
import { mapFiles } from './util';

const commands = mapFiles<Command>(require.context('./cmds', false, /\.ts$/)),
	applicationCommandHandler = createApplicationCommandHandler({
		applicationId: CLIENT_ID,
		applicationSecret: CLIENT_SECRET,
		publicKey: PUBLIC_KEY,
		commands,
	});

addEventListener('fetch', (event) => event.respondWith(applicationCommandHandler(event.request)));
