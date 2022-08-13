import {
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

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

		if (!events.length)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'There are no events matching the specified type.',
					flags: MessageFlags.Ephemeral,
				},
			};

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: events
					.slice(0, 6)
					.reduce(
						(a, { name, type, start, end }) =>
							`${a}**${name.replaceAll('_', ' ')}** (${
								eventTypes.find(({ value }) => value === type)?.name
							})\n${buildEmoji('875985515357282316')} ${discordTimestamp(
								start,
								'D'
							)} → ${discordTimestamp(end, 'D')} (ending in ${discordTimestamp(end, 'R')})\n\n`,
						''
					),
			},
		};
	},
};
