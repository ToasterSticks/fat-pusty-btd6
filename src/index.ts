import {
	createApplicationCommandHandler,
	Permissions,
	PermissionType,
} from 'cloudflare-discord-bot';

import pingCommand from './cmds/ping';
import redditCommand from './cmds/reddit';
import challengeCommand from './cmds/challenge';

declare const CLIENT_ID: string;
declare const CLIENT_SECRET: string;
declare const PUBLIC_KEY: string;

const applicationCommandHandler = createApplicationCommandHandler({
	applicationId: CLIENT_ID,
	applicationSecret: CLIENT_SECRET,
	publicKey: PUBLIC_KEY,
	// guildId: '826591380716388353',
	commands: [pingCommand, redditCommand, challengeCommand],
	permissions: new Permissions([
		PermissionType.ADD_REACTIONS,
		PermissionType.ATTACH_FILES,
		PermissionType.EMBED_LINKS,
		PermissionType.SEND_MESSAGES,
		PermissionType.USE_EXTERNAL_EMOJIS,
		PermissionType.USE_EXTERNAL_STICKERS,
	]),
});

addEventListener('fetch', (event) => {
	event.respondWith(applicationCommandHandler(event.request));
});
