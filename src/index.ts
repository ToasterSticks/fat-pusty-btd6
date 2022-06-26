import { createApplicationCommandHandler, Permissions } from 'cloudflare-discord-bot';

import commands from './cmds';

const applicationCommandHandler = createApplicationCommandHandler({
	applicationId: CLIENT_ID,
	applicationSecret: CLIENT_SECRET,
	publicKey: PUBLIC_KEY,
	permissions: new Permissions([]),
	// @ts-expect-error Using Discord-API-Types v10
	commands,
});

addEventListener('fetch', (event) => {
	event.respondWith(applicationCommandHandler(event.request));
});
