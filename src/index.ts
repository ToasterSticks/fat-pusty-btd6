import { createApplicationCommandHandler } from 'cloudflare-discord-bot';

import { commands } from './cmds';

const applicationCommandHandler = createApplicationCommandHandler({
	applicationId: CLIENT_ID,
	applicationSecret: CLIENT_SECRET,
	publicKey: PUBLIC_KEY,
	// @ts-expect-error Handler interaction types
	commands,
});

addEventListener('fetch', (event) => {
	event.respondWith(applicationCommandHandler(event.request));
});
