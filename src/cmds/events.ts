import { ApplicationCommandOptionType, InteractionResponseType } from 'discord-api-types/v10';

import { SlashCommand } from '../types';
import { discordTimestamp, buildEmoji, getOption, getEvents } from '../util';

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
	handler: async ({ data: { options } }) => {
		const type = getOption<string>(options, 'type');

		const events = await getEvents(type);

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: events.length
					? events.reduce((a, { name, type, start, end }) => {
							const fmtType = eventTypes.find(({ value }) => value === type)?.name;

							return `${a}${name.replaceAll('_', ' ')} (${fmtType})\n${buildEmoji(
								'875985515357282316'
							)} ${discordTimestamp(start, 'd')} → ${discordTimestamp(end, 'd')}\n`;
					  }, '')
					: `No events found matching the specified type.`,
			},
		};
	},
};
