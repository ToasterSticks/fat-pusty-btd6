import {
	APIChatInputApplicationCommandGuildInteraction,
	APIInteractionResponse,
	InteractionResponseType,
} from 'discord-api-types/v10';

import { SlashCommand } from '../types';

const command: SlashCommand = [
	{
		name: 'ping',
		description: 'Reply with pong',
	},
	(interaction: APIChatInputApplicationCommandGuildInteraction): APIInteractionResponse => {
		const userID = interaction.member.user.id;

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: `Pong! <@${userID}>!`,
				allowed_mentions: { users: [userID] },
				flags: 1 << 6,
			},
		};
	},
];

export default command;
