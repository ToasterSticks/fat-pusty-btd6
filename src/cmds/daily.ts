import { ApplicationCommandOptionType, InteractionResponseType } from 'discord-api-types/v10';

import { getOption } from '../helpers';
import { BloonsChallengeData, SlashCommand } from '../types';
import { generateChallengeEmbed } from '../helpers';

const command: SlashCommand = [
	{
		name: 'daily-challenge',
		description: "Display the daily challenge's details",
		options: [
			{
				name: 'advanced',
				description: 'Whether to display the advanced challenge',
				type: ApplicationCommandOptionType.Boolean,
			},
			{
				name: 'challenge',
				description: 'The number of the daily challenge to display',
				type: ApplicationCommandOptionType.Integer,
			},
		],
	},
	async ({ data }) => {
		const normalId = Math.trunc((Date.now() / 1000 - 1533974400) / 60 / 60 / 24);
		const advancedId = Math.trunc((Date.now() / 1000 - 1535097600) / 60 / 60 / 24);
		const isAdvanced = getOption(data, 'advanced') as boolean | null;
		const id = (getOption(data, 'challenge') || isAdvanced ? advancedId : normalId).toString();

		const challenge = (await fetch(
			`https://fast-static-api.nkstatic.com/storage/static/appdocs/11/dailyChallenges${
				isAdvanced ? 'Advanced' : ''
			}/${id}`
		)
			.then((res) => res.json())
			.catch(() => null)) as BloonsChallengeData | null;

		if (!challenge)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: { content: 'There is no data for the provided challenge number.' },
			};

		const embed = generateChallengeEmbed(challenge, id, isAdvanced ? 'Advanced' : 'Daily');

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: '',
				embeds: [embed],
			},
		};
	},
];

export default command;
