import {
	APIEmbed,
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { PublicUserProfile, SlashCommand } from '../types';
import { findUser, getOption, addNumberSeparator, spacePascalCase } from '../util';

const command: SlashCommand = [
	{
		name: 'profile',
		description: "Display a user's profile (WIP)",
		options: [
			{
				name: 'user',
				description: 'The user whose profile to display',
				type: ApplicationCommandOptionType.String,
			},
		],
	},
	async ({ data: { options }, member: { user } }) => {
		const code = getOption<string>(options, 'user');
		const query = code ?? (await KV.get(user.id));

		if (!query)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'A user must be provided.',
					flags: MessageFlags.Ephemeral,
				},
			};

		const btdUser = await findUser(query);

		if (!btdUser)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'The provided user is invalid.',
					flags: MessageFlags.Ephemeral,
				},
			};

		const profile = (await fetch(
			`https://fast-static-api.nkstatic.com/storage/static/11/${btdUser.nkapiID}/public-stats`
		)
			.then((res) => res.json())
			.catch(() => null)) as PublicUserProfile;

		if (!profile)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'There is no data available for this user.',
					flags: MessageFlags.Ephemeral,
				},
			};

		const embed: APIEmbed = {
			color: 13296619,
			author:
				profile.veteranRank && profile.veteranXp
					? {
							name: `Veteran ${profile.veteranRank} (${addNumberSeparator(
								profile.veteranXp - (profile.veteranRank - 1) * 20_000_000
							)}/20,000,000 XP)`,
							icon_url: 'https://i.gyazo.com/5eb0d239047f10708d9d9bdc8e318cff.png',
					  }
					: {
							name: `Level ${profile.playerRank} (${addNumberSeparator(
								profile.playerXp - TOTAL_XP_REQUIRED[profile.playerRank - 1] + 1000
							)}/${addNumberSeparator(
								TOTAL_XP_REQUIRED[profile.playerRank] - TOTAL_XP_REQUIRED[profile.playerRank - 1]
							)} XP)`,
							icon_url: 'https://i.gyazo.com/77b67f0ab4ab75ab36eb31e090f3630b.png',
					  },
			title: btdUser.displayName,
			footer: { text: `ID: ${btdUser.nkapiID}` },
			fields: [
				{
					name: 'General Info',
					value: [
						`Games played: ${addNumberSeparator(profile.gameCount)}`,
						`Games won: ${addNumberSeparator(profile.gamesWon)}`,
						`Highest round: ${addNumberSeparator(profile.highestRound)}`,
						`Bloons popped: ${addNumberSeparator(profile.bloonsPopped)}`,
						`Cash earned: ${addNumberSeparator(profile.cashEarned)}`,
						`Powers used: ${profile.powersUsed ?? 0}`,
						`Achievements completed: ${
							profile.achievementsClaimed.length - profile.hiddenAchievementsClaimed.length
						}/${profile.achievements.length}`,
						`Hidden achievements: ${profile.hiddenAchievementsClaimed.length}/${profile.hiddenAchievements.length}`,
						`Monkey Teams wins: ${addNumberSeparator(profile.monkeyTeamsWins ?? 0)}`,
						`Golden Bloons popped: ${addNumberSeparator(profile.goldenBloonsPopped ?? 0)}`,
					]
						.filter((x) => x)
						.join('\n'),
				},
				{
					name: 'Towers',
					value: [
						`Most experienced: ${
							profile.mostExperiencedMonkey
								? `${spacePascalCase(profile.mostExperiencedMonkey)} (${addNumberSeparator(
										profile.mostExperiencedMonkeyXp!
								  )} XP)`
								: 'None'
						}`,
						`Instas used: ${addNumberSeparator(profile.instaMonkeysUsed ?? 0)}`,
						`Insta collection: ${addNumberSeparator(profile.instaMonkeyCollection ?? 0)}`,
						`Collection chests opened: ${addNumberSeparator(profile.collectionChestsOpened ?? 0)}`,
					]
						.filter((x) => x)
						.join('\n'),
				},
				{
					name: 'Medals',
					value: [`Solo: Looool coming soon`].filter((x) => x).join('\n'),
				},
			],
		};

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: '',
				embeds: [embed],
			},
		};
	},
];

const TOTAL_XP_REQUIRED = [
	0, 280, 900, 1780, 3350, 5850, 8850, 12350, 15850, 19850, 24100, 28600, 33100, 38000, 45000,
	53000, 62000, 72000, 83000, 95000, 108000, 122000, 137000, 153000, 170000, 188000, 207000, 227000,
	250000, 275000, 305000, 340000, 380000, 425000, 475000, 530000, 590000, 655000, 725000, 800000,
	880000, 965000, 1055000, 1150000, 1250000, 1355000, 1465000, 1580000, 1700000, 1830000, 1970000,
	2120000, 2280000, 2450000, 2630000, 2820000, 3020000, 3230000, 3450000, 3680000, 3920000, 4170000,
	4430000, 4700000, 4980000, 5270000, 5570000, 5880000, 6200000, 6530000, 6870000, 7220000, 7580000,
	7950000, 8330000, 8720000, 9120000, 9530000, 9950000, 10380000, 10820000, 11270000, 11730000,
	12200000, 12680000, 13170000, 13670000, 14180000, 14700000, 15230000, 15770000, 16320000,
	16880000, 17450000, 18030000, 18620000, 19220000, 19830000, 20450000, 21080000, 21730000,
	22430000, 23180000, 23980000, 24830000, 25730000, 26680000, 27680000, 28730000, 29830000,
	30980000, 32180000, 33430000, 34730000, 36080000, 37480000, 38930000, 40430000, 41980000,
	43580000, 45230000, 46930000, 48680000, 50480000, 52330000, 54230000, 56180000, 58180000,
	60230000, 62330000, 64480000, 66680000, 68930000, 71230000, 73580000, 75980000, 78430000,
	80930000, 83480000, 86080000, 88730000, 91430000, 94180000, 96980000, 99830000, 102730000,
	105680000, 108680000, 111730000, 120001000, 130001000, 141001000, 153001000, 166001000,
];

export default command;
