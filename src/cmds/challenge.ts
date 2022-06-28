import { inflate } from 'pako';
import {
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { BloonsChallengeData, SlashCommand } from '../types';
import { generateChallengeEmbed, getOption } from '../helpers';

const command: SlashCommand = [
	{
		name: 'challenge',
		description: "Display a challenge's details",
		options: [
			{
				name: 'code',
				description: 'The challenge code',
				type: ApplicationCommandOptionType.String,
				required: true,
			},
		],
	},
	async ({ data }) => {
		const code = getOption(data, 'code') as string;

		const b64Str = await fetch(
			`https://static-api.nkstatic.com/appdocs/11/es/challenges/${code}`
		).then((res) => res.text());

		let decompressed: string;

		try {
			decompressed = inflate(
				new Uint8Array(
					atob(b64Str)
						.split('')
						.map((x) => x.charCodeAt(0))
				),
				{ to: 'string' }
			);
		} catch {
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'The provided challenge code is invalid.',
					flags: MessageFlags.Ephemeral,
				},
			};
		}

		const challenge: BloonsChallengeData = JSON.parse(decompressed);

		const embed = generateChallengeEmbed(challenge, code);

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
