import {
	APIChatInputApplicationCommandGuildInteraction,
	ApplicationCommandOptionType,
	InteractionResponseType,
} from 'discord-api-types/v10';

import { BloonsChallengeData, SlashCommand } from '../types';
import { generateEmbed } from './challenge';

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
		],
	},
	async ({ data }: APIChatInputApplicationCommandGuildInteraction) => {
		const normalId = Math.trunc((Date.now() / 1000 - 1533974400) / 60 / 60 / 24);
		const advancedId = Math.trunc((Date.now() / 1000 - 1535097600) / 60 / 60 / 24);
		const isAdvanced =
			data.options?.[0].type === ApplicationCommandOptionType.Boolean && data.options[0].value;
		const id = (isAdvanced ? advancedId : normalId).toString();

		const challenge = (await fetch(
			`https://fast-static-api.nkstatic.com/storage/static/appdocs/11/dailyChallenges${
				isAdvanced ? 'Advanced' : ''
			}/${id}`
		).then((res) => res.json())) as BloonsChallengeData;

		const embed = generateEmbed(challenge, id, isAdvanced ? 'Advanced' : 'Daily');

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
