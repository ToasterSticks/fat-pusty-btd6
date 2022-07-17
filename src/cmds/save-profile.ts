import {
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { AuthorizedUserData, SlashCommand } from '../types';
import { formRequestOptions, getOption } from '../helpers';

const command: SlashCommand = [
	{
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
	},
	async ({ data, member: { user } }) => {
		const code = (getOption(data, 'code') as string).toUpperCase();

		const nonce = (Math.random() * Math.pow(2, 63)).toString();

		const { users } = await fetch(
			'https://api.ninjakiwi.com/user/search',
			formRequestOptions(
				{
					method: 'shortcode',
					keys: [code],
					includeOnlineStatus: false,
				},
				nonce
			)
		)
			.then((res) => res.json() as Promise<{ data: string }>)
			.then(({ data }) => JSON.parse(data) as AuthorizedUserData);

		const userArr = Object.values(users);

		if (!userArr.length)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'The user ID provided is invalid.',
					flags: MessageFlags.Ephemeral,
				},
			};

		await KV.put(user.id, code);

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: `The profile with the name \`${userArr[0].displayName}\` has been linked to your Discord account.`,
				flags: MessageFlags.Ephemeral,
			},
		};
	},
];

export default command;
