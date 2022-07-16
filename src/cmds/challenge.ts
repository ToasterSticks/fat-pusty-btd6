import { inflate } from 'pako';
import {
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';
// @ts-expect-error No fucking types
import nksku from 'nksku';

import { AuthorizedChallengeData, BloonsChallengeData, SlashCommand } from '../types';
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
		const code = (getOption(data, 'code') as string).toUpperCase();

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

		const nonce = (Math.random() * Math.pow(2, 63)).toString();

		const reqStr = JSON.stringify({
			index: 'challenges',
			query: `id:${code}`,
			limit: 1,
			offset: 0,
			hint: 'single_challenge',
			options: {},
		});

		const {
			results: [{ stats }],
		} = (await fetch('https://api.ninjakiwi.com/utility/es/search', {
			method: 'POST',
			body: JSON.stringify({
				data,
				auth: {
					session: null,
					appID: 11,
					skuID: 35,
					device: null,
				},
				sig: nksku.signonce.sign(reqStr, nonce),
				nonce,
			}),
			headers: { 'User-Agent': 'btd6-windowsplayer-31.2', 'Content-Type': 'application/json' },
		})
			.then((res) => res.json() as Promise<{ data: string }>)
			.then(({ data }) => JSON.parse(data))) as AuthorizedChallengeData;

		const embed = generateChallengeEmbed({ data: challenge, id: code, stats });

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
