import {
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { SlashCommand } from '../types';
import { getOption, OWNERS } from '../util';

export const command: SlashCommand = {
	name: 'set-boss',
	description: 'Set the current boss event',
	options: [
		{
			name: 'type',
			description: 'The boss type to set',
			type: ApplicationCommandOptionType.String,
			choices: [
				{ name: 'Bloonarius', value: 'Bloonarius' },
				{ name: 'Lych', value: 'Lych' },
				{ name: 'Vortex', value: 'Vortex' },
			],
			required: true,
		},
		{
			name: 'number',
			description: 'The upcoming number of the boss',
			type: ApplicationCommandOptionType.Integer,
			required: true,
		},
	],
	handler: async ({ data: { options }, member: { user } }) => {
		if (!OWNERS.includes(user.id))
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'You are not authorized to use this command.',
					flags: MessageFlags.Ephemeral,
				},
			};

		const type = getOption<string>(options, 'type')!;
		const number = getOption<number>(options, 'number')!;

		await KV.put('boss', type + number);

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { content: `The boss event has been set to \`${type} - ${number}\`.` },
		};
	},
};
