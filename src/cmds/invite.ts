import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';

import { SlashCommand } from '../types';

export const command: SlashCommand = {
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
