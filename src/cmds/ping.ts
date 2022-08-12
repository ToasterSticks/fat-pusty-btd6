import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';

import { SlashCommand } from '../types';

export const command: SlashCommand = {
	name: 'ping',
	description: 'Reply with pong',
	handler: ({ member: { user } }) => {
		const userID = user.id;

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: `Pong! <@${userID}>!`,
				allowed_mentions: { users: [userID] },
				flags: MessageFlags.Ephemeral,
			},
		};
	},
};
