import type { Command } from '../http-interactions';
import type { ApplicationCommandType } from 'discord-api-types/v10';
import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';

export const command: Command<ApplicationCommandType.ChatInput> = {
	name: 'ping',
	description: 'Reply with pong',
	handler: ({ member }) => {
		const userID = member!.user.id;

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
