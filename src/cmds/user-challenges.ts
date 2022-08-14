import {
	APIButtonComponent,
	APIEmbed,
	ApplicationCommandOptionType,
	ButtonStyle,
	ComponentType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { AuthorizedChallengeData, CommandBody } from '../types';
import {
	buildEmoji,
	cacheInteraction,
	discordTimestamp,
	findUser,
	formRequestOptions,
	getOption,
	movePage,
	spacePascalCase,
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
		{
			name: 'page',
			description: 'The page of challenges to display',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
		},
	],
	handler: async (interaction, page?: number) => {
		const {
			data: { options },
			member: { user },
		} = interaction;

		const code = getOption<string>(options, 'user');
		const query = code ?? (await PROFILES.get(user.id));

		const componentTrigger = page !== undefined;

		page ??= getOption<number>(options, 'page') ?? 1;

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

		const pages = Math.ceil(results.length / 5);

		if (page > pages) page = pages;

		const endIndex = page * 5;

		const list = results
			.slice(endIndex - 5, endIndex)
			.reduce((a, { id, createdAt, challengeName, map, stats }) => {
				if (map === 'Tutorial') map = 'MonkeyMeadow';
				if (map === 'TownCentre') map = 'TownCenter';

				const attempts = stats.plays + (stats.restarts ?? 0);
				const winRate = attempts ? (stats.wins / attempts) * 100 : 0;
				const completionRate = attempts ? (stats.winsUnique / stats.playsUnique) * 100 : 0;

				return `${a}[\`${id}\`](https://join.btd6.com/Challenge/${id} 'Map: ${spacePascalCase(
					map
				)}') - **${challengeName}**\n${buildEmoji('875985515357282316')} ${discordTimestamp(
					createdAt,
					'R'
				)} | CR: ${
					completionRate > 0 && completionRate < 1 ? '<1' : Math.round(completionRate)
				}% - WR: ${winRate > 0 && winRate < 1 ? '<1' : Math.round(winRate)}%\n\n`;
			}, '');

		const leftButton: APIButtonComponent = {
			type: ComponentType.Button,
			style: ButtonStyle.Secondary,
			label: '◀',
			custom_id: 'left',
			disabled: page === 1,
		};

		const rightButton: APIButtonComponent = {
			type: ComponentType.Button,
			style: ButtonStyle.Secondary,
			label: '▶',
			custom_id: 'right',
			disabled: page === pages,
		};

		const embed: APIEmbed = {
			color: 13296619,
			title: btdUser.displayName,
			thumbnail: { url: 'https://i.gyazo.com/1a2e98dd6d3809a1d09fcb34f7a78649.png' },
			description: list,
			footer: {
				text: `Page ${page}/${pages} | Tip: hover over the code`,
			},
		};

		if (pages > 1 && !componentTrigger) cacheInteraction(interaction);

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				embeds: [embed],
				components:
					pages > 1
						? [{ type: ComponentType.ActionRow, components: [leftButton, rightButton] }]
						: [],
			},
		};
	},
	components: {
		left: (interaction) => movePage(command, interaction, -1),
		right: (interaction) => movePage(command, interaction, 1),
	},
};
