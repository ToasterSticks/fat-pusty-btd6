import {
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { CommandBody } from '../types';
import { findUser, getOption } from '../util';

export const command: CommandBody = {
	name: 'save-profile',
	description: 'Save your BTD6 profile',
	options: [
		{
			name: 'code',
			description: 'The user id (found in BTD6 settings next to version)',
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],

	handler: async ({ data: { options }, member: { user } }) => {
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

		await PROFILES.put(user.id, btdUser.nkapiID);

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: `The profile with the name \`${btdUser.displayName}\` has been linked to your Discord account.`,
				flags: MessageFlags.Ephemeral,
			},
		};
	},
};
