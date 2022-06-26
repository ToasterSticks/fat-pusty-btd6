import { createApplicationCommandHandler, Permissions } from 'cloudflare-discord-bot';

import commands from './cmds';

const applicationCommandHandler = createApplicationCommandHandler({
	applicationId: CLIENT_ID,
	applicationSecret: CLIENT_SECRET,
	publicKey: PUBLIC_KEY,
	// guildId: '826591380716388353',
	permissions: new Permissions([]),
	commands,
});

addEventListener('fetch', (event) => {
	event.respondWith(applicationCommandHandler(event.request));
});
