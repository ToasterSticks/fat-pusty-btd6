import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';

import { CommandBody } from '../types';

export const command: CommandBody = {
	name: 'ping',
	description: 'Reply with pong',
	handler: ({ member: { user } }) => {
		const userID = user.id;

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: `<@${userID}>, pong!`,
				allowed_mentions: { users: [userID] },
				flags: MessageFlags.Ephemeral,
			},
		};
	},
};
