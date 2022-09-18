import type { Command } from '../http-interactions';
import type { ApplicationCommandType } from 'discord-api-types/v10';
import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';

export const command: Command<ApplicationCommandType.ChatInput> = {
	name: 'invite',
	description: 'Add the application to your server',

	handler: () => {
		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: `Add me to a server by clicking [here](${INVITE_URL}).`,
				flags: MessageFlags.Ephemeral,
			},
		};
	},
};

const INVITE_URL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=applications.commands`;
