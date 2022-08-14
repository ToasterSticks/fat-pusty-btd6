import {
	APIButtonComponent,
	APIEmbed,
	ApplicationCommandOptionType,
	ButtonStyle,
	ComponentType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { CommandBody } from '../types';
import {
	discordTimestamp,
	buildEmoji,
	getOption,
	getEvents,
	cacheInteraction,
	movePage,
} from '../util';

const eventTypes = [
	{ name: 'Trophy Store', value: 'trophyStore' },
	{ name: 'Knowledge Sale', value: 'knowledgeSale' },
	{ name: 'Newsbanner', value: 'newsbanner' },
	{ name: 'Monkey Team', value: 'monkeyTeam' },
	{ name: 'Insta Tower Sale', value: 'instaTowerSale' },
	{ name: 'Odyssey Event', value: 'odysseyEvent' },
	{ name: 'MM Sale', value: 'mmSale' },
	{ name: 'Race Event', value: 'raceEvent' },
	{ name: 'Boss Bloon', value: 'bossBloon' },
	{ name: 'Coop Challenge', value: 'coopChallenge' },
	{ name: 'Holiday Skin', value: 'holidaySkin' },
	{ name: 'Collectable Event', value: 'collectableEvent' },
	{ name: 'Golden Bloon', value: 'goldenBloon' },
	{ name: 'Update Popup', value: 'updatePopup' },
	{ name: 'Contested Territory', value: 'ct' },
];

export const command: CommandBody = {
	name: 'events',
	description: 'Display ongoing and upcoming events',
	options: [
		{
			name: 'type',
			description: 'The type of event to filter',
			type: ApplicationCommandOptionType.String,
			choices: eventTypes,
		},
		{
			name: 'page',
			description: 'The page of events to display',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
		},
	],
	handler: async (interaction, page?: number) => {
		const {
			data: { options },
		} = interaction;

		const type = getOption<string>(options, 'type');

		const componentTrigger = page !== undefined;

		page ??= getOption<number>(options, 'page') ?? 1;

		const events = await getEvents(type);

		if (!events.length)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'There are no events matching the specified type.',
					flags: MessageFlags.Ephemeral,
				},
			};

		const pages = Math.ceil(events.length / 5);

		if (page > pages) page = pages;

		const endIndex = page * 5;

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
			title: `${type ? eventTypes.find(({ value }) => value === type)?.name : 'All'} Events`,
			description: events.slice(endIndex - 5, endIndex).reduce((a, { name, type, start, end }) => {
				name = name.replaceAll('_', ' ');
				const hasStarted = Date.now() >= start;
				const fmtType = eventTypes.find(({ value }) => value === type)?.name;

				return `${a}**${name}** (${fmtType})\n${buildEmoji(
					'875985515357282316'
				)} ${discordTimestamp(start, 'D')} → ${discordTimestamp(end, 'D')} (${
					hasStarted ? 'ending' : 'starting'
				} ${discordTimestamp(hasStarted ? end : start, 'R')})\n\n`;
			}, ''),
			footer: { text: `Page ${page}/${pages}` },
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
