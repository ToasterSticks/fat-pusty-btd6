import {
	APIApplicationCommandInteractionDataSubcommandOption,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { getOption, generateChallengeEmbed } from '../util';
import { BloonsChallengeData } from '../types';
import { Command } from '../http-interactions';

export const command: Command<ApplicationCommandType.ChatInput> = {
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
	handler: async ({ data: { options } }) => {
		const normalId = Math.trunc((Date.now() / 1000 - 1533974400) / 60 / 60 / 24),
			advancedId = Math.trunc((Date.now() / 1000 - 1535097600) / 60 / 60 / 24),
			normSubOptions = getOption<APIApplicationCommandInteractionDataSubcommandOption[]>(
				options,
				'normal'
			),
			advSubOptions = getOption<APIApplicationCommandInteractionDataSubcommandOption[]>(
				options,
				'advanced'
			),
			id = (
				getOption<string>(normSubOptions ?? advSubOptions, 'challenge') ??
				(advSubOptions ? advancedId : normalId)
			).toString(),
			challenge = (await fetch(
				`https://fast-static-api.nkstatic.com/storage/static/appdocs/11/dailyChallenges${
					advSubOptions ? 'Advanced' : ''
				}/${id}`
			)
				.then((res) => res.json())
				.catch(() => null)) as BloonsChallengeData | null;

		if (!challenge)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'There is no data for the provided challenge number.',
					flags: MessageFlags.Ephemeral,
				},
			};

		const embed = generateChallengeEmbed({
			data: challenge,
			type: advSubOptions ? 'Advanced' : 'Daily',
			id,
		});

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { embeds: [embed] },
		};
	},
};
