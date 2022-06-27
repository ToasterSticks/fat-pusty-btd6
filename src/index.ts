import { createApplicationCommandHandler, Permissions } from 'cloudflare-discord-bot';

import { commands, components } from './cmds';

const applicationCommandHandler = createApplicationCommandHandler({
	applicationId: CLIENT_ID,
	applicationSecret: CLIENT_SECRET,
	publicKey: PUBLIC_KEY,
	permissions: new Permissions([]),
	// @ts-expect-error I want my types
	commands,
	// @ts-expect-error ---
	components,
});

addEventListener('fetch', (event) => {
	event.respondWith(applicationCommandHandler(event.request));
});
