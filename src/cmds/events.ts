import {
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { Event, SlashCommand } from '../types';
import { discordTimestamp, getOption } from '../util';

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
	{ name: 'CT', value: 'ct' },
];

export const command: SlashCommand = {
	name: 'events',
	description: 'Display ongoing and upcoming events',
	options: [
		{
			name: 'type',
			description: 'The type of event to filter',
			type: ApplicationCommandOptionType.String,
			choices: eventTypes,
		},
	],
	handler: async ({ data: { options }, member: { user } }) => {
		const type = getOption<string>(options, 'type');

		const body = await fetch(
			'https://static-api.nkstatic.com/nkapi/skusettings/7e6e7a76e92ea636c1e257459bba8181.json'
		)
			.then((res) => res.arrayBuffer())
			.then((buffer) => new Uint8Array(buffer));

		let {
			settings: { events },
		}: { settings: { events: Event[] } } = JSON.parse(
			JSON.parse(
				body.slice(14).reduce((a, curr, i) => a + String.fromCharCode(curr - 21 - (i % 6)), '')
			).data
		);

		if (type) events = events.filter((event) => event.type === type);

		events = events.filter((event) => Date.now() < event.end).slice(0, 10);
		events.sort((a, b) => (a.start === b.start ? a.end - b.end : a.start - b.start));

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: events.reduce((a, { name, type, start, end }) => {
					name = name.replaceAll('_', '\\_');
					const fmtType = eventTypes.find(({ value }) => value === type)?.name;
					const emoji = '<:_:875985515357282316>';
					return `${a}${name} (${fmtType})\n${emoji} ${discordTimestamp(
						start,
						'd'
					)} → ${discordTimestamp(end, 'd')}\n`;
				}, ''),
			},
		};
	},
};
