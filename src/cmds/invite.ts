import {
	ApplicationCommand,
	InteractionHandler,
	InteractionResponse,
	InteractionResponseType,
} from 'cloudflare-discord-bot';

const command: [ApplicationCommand, InteractionHandler] = [
	{
		name: 'invite',
		description: 'Invite the bot to your server',
	},
	async (): Promise<InteractionResponse> => {
		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { content: `Invite me to a server by clicking [here](${INVITE_URL}).` },
		};
	},
];

const INVITE_URL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=applications.commands`;

export default command;
