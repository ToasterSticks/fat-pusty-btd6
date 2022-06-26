import {
	APIChatInputApplicationCommandGuildInteraction,
	APIInteractionResponse,
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
	async ({
		data,
	}: APIChatInputApplicationCommandGuildInteraction): Promise<APIInteractionResponse> => {
		const normal_id = Math.trunc((Date.now() / 1000 - 1533974400) / 60 / 60 / 24);
		const advanced_id = Math.trunc((Date.now() / 1000 - 1535097600) / 60 / 60 / 24);
		const is_advanced =
			data.options?.[0].type === ApplicationCommandOptionType.Boolean && data.options[0].value;
		const id = (is_advanced ? advanced_id : normal_id).toString();

		const challenge = (await fetch(
			`https://fast-static-api.nkstatic.com/storage/static/appdocs/11/dailyChallenges${
				is_advanced ? 'Advanced' : ''
			}/${id}`
		).then((res) => res.json())) as BloonsChallengeData;

		const embed = generateEmbed(challenge, id, is_advanced ? 'Advanced' : 'Daily');

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
