import {
	APIChatInputApplicationCommandGuildInteraction,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { SlashCommand } from '../types';

const command: SlashCommand = [
	{
		name: 'ping',
		description: 'Reply with pong',
	},
	({ member }: APIChatInputApplicationCommandGuildInteraction) => {
		const userID = member.user.id;

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: `Pong! <@${userID}>!`,
				allowed_mentions: { users: [userID] },
				flags: MessageFlags.Ephemeral,
			},
		};
	},
];

export default command;
