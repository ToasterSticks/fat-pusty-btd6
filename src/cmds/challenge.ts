import { inflate } from 'pako';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { AuthorizedChallengeData, AuthorizedUserData, BloonsChallengeData } from '../types';
import { formRequestOptions, generateChallengeEmbed, getOption } from '../util';
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

		const [b64Str, { results }] = await Promise.all([
			fetch(`https://static-api.nkstatic.com/appdocs/11/es/challenges/${code}`).then((res) =>
				res.text()
			),
			fetch(
				'https://api.ninjakiwi.com/utility/es/search',
				formRequestOptions({
					index: 'challenges',
					query: `id:${code}`,
					limit: 1,
					offset: 0,
					hint: 'single_challenge',
					options: {},
				})
			)
				.then((res) => res.json() as Promise<{ data: string }>)
				.then(({ data }) => JSON.parse(data) as AuthorizedChallengeData),
		]);

		const info = results[0] ?? {};

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
		const creatorID = info.owner;

		if (info)
			await Promise.all(
				(
					[
						['owner', info.owner],
						['firstWin', info.stats.firstWin?.slice(3)],
						['latestWin', info.stats.latestWin?.slice(3)],
					] as const
				).map(async ([key, value]) => {
					if (!value && key !== 'owner') {
						info.stats[key] = '';
						return;
					}

					const { users } = await fetch(
						'https://api.ninjakiwi.com/user/search',
						formRequestOptions({
							method: 'nkapiID',
							keys: [value],
							includeOnlineStatus: false,
						})
					)
						.then((res) => res.json() as Promise<{ data: string }>)
						.then(({ data }) => JSON.parse(data) as AuthorizedUserData);

					if (key === 'owner') info[key] = Object.values(users)[0].displayName;
					else info.stats[key] = Object.values(users)[0].displayName;
				})
			);

		const embed = generateChallengeEmbed({
			data: challenge,
			id: code,
			info,
		});

		embed.footer = { text: creatorID };

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { embeds: [embed] },
		};
	},
};
