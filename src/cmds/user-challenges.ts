import {
	APIEmbed,
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { AuthorizedChallengeData, CommandBody } from '../types';
import {
	findUser,
	formRequestOptions,
	getOption,
	spacePascalCase,
	trimJoinedLength,
} from '../util';

export const command: CommandBody = {
	name: 'user-challenges',
	description: "Display a user's challenges",
	options: [
		{
			name: 'user',
			description: 'The user whose challenges to display',
			type: ApplicationCommandOptionType.String,
		},
	],
	handler: async ({ data: { options }, member: { user } }) => {
		const code = getOption<string>(options, 'user');
		const query = code ?? (await KV.get(user.id));

		if (!query)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'A user must be provided.',
					flags: MessageFlags.Ephemeral,
				},
			};

		const btdUser = await findUser(query);

		if (!btdUser)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'The provided user is invalid.',
					flags: MessageFlags.Ephemeral,
				},
			};

		const { results } = await fetch(
			'https://api.ninjakiwi.com/utility/es/search/full',
			formRequestOptions({
				index: 'challenges',
				query: {
					bool: {
						must_not: [{ match: { isDeleted: true } }],
						should: [{ match: { owner: btdUser.nkapiID } }],
					},
				},
				options: {
					sort: [{ createdAt: 'desc' }],
					search_type: 'query_then_fetch',
				},
				limit: 9999,
				offset: 0,
			})
		)
			.then((res) => res.json() as Promise<{ data: string }>)
			.then(({ data }) => JSON.parse(data) as AuthorizedChallengeData);

		if (!results.length)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: "The provided user doesn't have any challenges.",
					flags: MessageFlags.Ephemeral,
				},
			};

		const [challengeList, itemsLeft] = trimJoinedLength(
			results.map(({ id, createdAt, challengeName, map, stats }) => {
				if (map === 'Tutorial') map = 'MonkeyMeadow';
				if (map === 'TownCentre') map = 'TownCenter';

				const attempts = stats.plays + (stats.restarts ?? 0);

				return `[\`${id}\`](https://join.btd6.com/Challenge/${id} '${[
					`Map: ${spacePascalCase(map)}`,
					attempts
						? `Completion rate: ${Math.round((stats.winsUnique / stats.playsUnique) * 100)}%`
						: '',
					attempts ? `Win rate: ${Math.round((stats.wins / attempts) * 100)}%` : '',
				]
					.join('\n')
					.trim()}') - <t:${Math.trunc(createdAt / 1000)}:R> - **${challengeName}**`;
			}),
			4096,
			'\n'
		);

		const embed: APIEmbed = {
			color: 13296619,
			title: btdUser.displayName,
			thumbnail: { url: 'https://i.gyazo.com/1a2e98dd6d3809a1d09fcb34f7a78649.png' },
			description: challengeList.join('\n'),
			footer: {
				text: `${
					itemsLeft ? `${itemsLeft} other challenges were omitted. ` : ''
				}Tip: hover over the code`,
			},
		};

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { embeds: [embed] },
		};
	},
};
