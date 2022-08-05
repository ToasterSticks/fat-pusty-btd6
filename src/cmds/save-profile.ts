import {
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { SlashCommand } from '../types';
import { findUser, getOption } from '../util';

const command: SlashCommand = [
	{
		name: 'save-profile',
		description: 'Save your BTD6 profile',
		options: [
			{
				name: 'code',
				description: 'The user id (found in BTD6 settings next to version)',
				type: ApplicationCommandOptionType.String,
				min_length: 9,
				max_length: 24,
				required: true,
			},
		],
	},
	async ({ data: { options }, member: { user } }) => {
		const code = getOption<string>(options, 'code')!.toUpperCase();
		const btdUser = await findUser(code);

		if (!btdUser)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'The provided user is invalid.',
					flags: MessageFlags.Ephemeral,
				},
			};

		await KV.put(user.id, code);

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: `The profile with the name \`${btdUser.displayName}\` has been linked to your Discord account.`,
				flags: MessageFlags.Ephemeral,
			},
		};
	},
];

export default command;
