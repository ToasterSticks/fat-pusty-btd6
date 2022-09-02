import { inflate } from 'pako';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { BloonsChallengeData } from '../types';
import { generateChallengeEmbed, getOption } from '../util';
import { Command } from '../http-interactions';

export const command: Command<ApplicationCommandType.ChatInput> = {
	name: 'challenge',
	description: "Display a challenge's details",
	options: [
		{
			name: 'code',
			description: 'The challenge code',
			type: ApplicationCommandOptionType.String,
			min_length: 7,
			max_length: 7,
			required: true,
		},
	],
	handler: async ({ data: { options } }) => {
		const code = getOption<string>(options, 'code')!.toUpperCase();

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

		const embed = generateChallengeEmbed({
			data: challenge,
			id: code,
		});

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { embeds: [embed] },
		};
	},
};
