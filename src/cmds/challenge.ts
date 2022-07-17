import { inflate } from 'pako';
import {
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';
// @ts-expect-error No fucking types
import nksku from 'nksku';

import {
	AuthorizedChallengeData,
	AuthorizedUserData,
	BloonsChallengeData,
	SlashCommand,
} from '../types';
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

		const nonce = (Math.random() * Math.pow(2, 63)).toString();

		const [b64Str, { results }] = await Promise.all([
			fetch(`https://static-api.nkstatic.com/appdocs/11/es/challenges/${code}`).then((res) =>
				res.text()
			),
			fetch(
				'https://api.ninjakiwi.com/utility/es/search',
				formRequestOptions(
					{
						index: 'challenges',
						query: `id:${code}`,
						limit: 1,
						offset: 0,
						hint: 'single_challenge',
						options: {},
					},
					nonce
				)
			)
				.then((res) => res.json() as Promise<{ data: string }>)
				.then(({ data }) => JSON.parse(data) as AuthorizedChallengeData),
		]);

		const { stats, owner } = results[0] ?? {};

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

		if (stats)
			await Promise.all(
				(
					[
						['creator', owner],
						['firstWin', stats.firstWin.slice(3)],
						['latestWin', stats.latestWin.slice(3)],
					] as const
				).map(async ([key, value]) => {
					const { users } = await fetch(
						'https://api.ninjakiwi.com/user/search',
						formRequestOptions(
							{
								method: 'nkapiID',
								keys: [value],
								includeOnlineStatus: false,
							},
							nonce
						)
					)
						.then((res) => res.json() as Promise<{ data: string }>)
						.then(({ data }) => JSON.parse(data) as AuthorizedUserData);

					stats[key] = Object.values(users)[0].displayName;
				})
			);

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

const formRequestOptions = (data: Record<string, unknown>, nonce: string) => {
	const dataStr = JSON.stringify(data);

	return {
		method: 'POST',
		body: JSON.stringify({
			data: dataStr,
			auth: {
				session: null,
				appID: 11,
				skuID: 35,
				device: null,
			},
			sig: nksku.signonce.sign(dataStr, nonce),
			nonce,
		}),
		headers: { 'User-Agent': 'btd6-windowsplayer-31.2', 'Content-Type': 'application/json' },
	};
};

export default command;
