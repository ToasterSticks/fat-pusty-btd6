import { Command } from 'cloudflare-discord-bot';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { findUser, getOption } from '../util';

export const command: Command<ApplicationCommandType.ChatInput> = {
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

	handler: async ({ data: { options }, member }) => {
		const code = getOption<string>(options, 'code')!;
		const btdUser = await findUser(code);

		if (!btdUser)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'The provided user is invalid.',
					flags: MessageFlags.Ephemeral,
				},
			};

		await PROFILES.put(member!.user.id, btdUser.nkapiID);

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: `The profile with the name \`${btdUser.displayName}\` has been linked to your Discord account.`,
				flags: MessageFlags.Ephemeral,
			},
		};
	},
};
