import {
	ApplicationCommand,
	InteractionHandler,
	Interaction,
	InteractionResponse,
	InteractionResponseType,
} from 'cloudflare-discord-bot';

const command: [ApplicationCommand, InteractionHandler] = [
	{
		name: 'ping',
		description: 'Reply with pong',
	},
	async (interaction: Interaction): Promise<InteractionResponse> => {
		const userID = interaction.member.user.id;

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: `Pong! <@${userID}>!`,
				allowed_mentions: { users: [userID] },
				// @ts-expect-error ephemeral
				flags: 1 << 6,
			},
		};
	},
];

export default command;
