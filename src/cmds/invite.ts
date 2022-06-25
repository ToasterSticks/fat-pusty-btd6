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
			data: {
				content:
					'Invite me to your server by clicking [here](https://discord.com/api/oauth2/authorize?client_id=990346742924996693&scope=applications.commands).',
			},
		};
	},
];

export default command;
