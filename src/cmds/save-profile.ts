import {
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { AuthorizedUserData, SlashCommand } from '../types';
import { formRequestOptions, getOption } from '../util';

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
				max_length: 9,
				required: true,
			},
		],
	},
	async ({ data: { options }, member: { user } }) => {
		const code = getOption<string>(options, 'code')!.toUpperCase();

		const { users } = await fetch(
			'https://api.ninjakiwi.com/user/search',
			formRequestOptions({
				method: 'shortcode',
				keys: [code],
				includeOnlineStatus: false,
			})
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
