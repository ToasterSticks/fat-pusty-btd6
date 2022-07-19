import {
	APIApplicationCommandInteractionDataSubcommandOption,
	ApplicationCommandOptionType,
	InteractionResponseType,
} from 'discord-api-types/v10';

import { getOption } from '../util';
import { BloonsChallengeData, SlashCommand } from '../types';
import { generateChallengeEmbed } from '../util';

const command: SlashCommand = [
	{
		name: 'daily-challenge',
		description: "Display the daily challenge's details",
		options: [
			{
				name: 'normal',
				description: "Display the normal daily challenge's details",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'challenge',
						description: 'The number of the daily challenge to display',
						type: ApplicationCommandOptionType.Integer,
					},
				],
			},
			{
				name: 'advanced',
				description: "Display the advanced challenge's details",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'challenge',
						description: 'The number of the advanced challenge to display',
						type: ApplicationCommandOptionType.Integer,
					},
				],
			},
		],
	},
	async ({ data: { options } }) => {
		const normalId = Math.trunc((Date.now() / 1000 - 1533974400) / 60 / 60 / 24);
		const advancedId = Math.trunc((Date.now() / 1000 - 1535097600) / 60 / 60 / 24);

		const normSubOptions = getOption<APIApplicationCommandInteractionDataSubcommandOption[]>(
			options,
			'normal'
		);

		const advSubOptions = getOption<APIApplicationCommandInteractionDataSubcommandOption[]>(
			options,
			'advanced'
		);

		const id = (
			getOption<string>(normSubOptions ?? advSubOptions, 'challenge') ??
			(advSubOptions ? advancedId : normalId)
		).toString();

		const challenge = (await fetch(
			`https://fast-static-api.nkstatic.com/storage/static/appdocs/11/dailyChallenges${
				advSubOptions ? 'Advanced' : ''
			}/${id}`
		)
			.then((res) => res.json())
			.catch(() => null)) as BloonsChallengeData | null;

		if (!challenge)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: { content: 'There is no data for the provided challenge number.' },
			};

		const embed = generateChallengeEmbed({
			data: challenge,
			type: advSubOptions ? 'Advanced' : 'Daily',
			id,
		});

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
