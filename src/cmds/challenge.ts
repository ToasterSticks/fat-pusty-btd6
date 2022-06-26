import pako from 'pako';
import {
	ApplicationCommand,
	InteractionHandler,
	Interaction,
	InteractionResponse,
	InteractionResponseType,
	ApplicationCommandOptionType,
	Embed,
} from 'cloudflare-discord-bot';
import { BloonsChallengeData, Tower } from '../types';

const command: [ApplicationCommand, InteractionHandler] = [
	{
		name: 'challenge',
		description: "Display a BTD6 challenge's details",
		options: [
			{
				name: 'code',
				description: 'The challenge code',
				type: ApplicationCommandOptionType.STRING,
				required: true,
			},
		],
	},
	async (interaction: Interaction): Promise<InteractionResponse> => {
		const code = (interaction.data?.options?.[0].value as unknown as string).toUpperCase();
		const b64Str = await fetch(
			`https://static-api.nkstatic.com/appdocs/11/es/challenges/${code}`
		).then((res) => res.text());

		let decompressed: string;

		try {
			decompressed = pako.inflate(
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
					// @ts-expect-error ephemeral
					flags: 1 << 6,
				},
			};
		}

		const data: BloonsChallengeData = JSON.parse(decompressed);

		if (data.map === 'Tutorial') data.map = 'MonkeyMeadow';
		if (data.map === 'Town Centre') data.map = 'TownCenter';
		if (data.mode === 'Clicks') data.mode = 'Chimps';

		const embed: Embed = {
			color: 13296619,
			title: data.name,
			url: `https://join.btd6.com/Challenge/${code}`,
			thumbnail: { url: `https://i.gyazo.com/${gamemodeIcons[data.mode]}.png` },
			author: {
				name: code,
				icon_url: `https://i.gyazo.com/${difficultyIcons[data.difficulty]}.png`,
			},
		};

		const description: string[] = [];

		description.push(
			`${spacePascalCase(data.map)} - ${data.difficulty} - ${spacePascalCase(data.mode)}\n`
		);

		if (data.disableSelling) description.push('<:_:947206526018387999> Selling disabled');
		if (data.disableMK) description.push('<:_:947206527721291786> Knowledge disabled');
		if (data.bloonModifiers.allCamo) description.push('<:_:947206526765002843> All camo');
		if (data.bloonModifiers.allRegen) description.push('<:_:947206530162376804> All regrow ');

		if (data.bloonModifiers.speedMultiplier !== 1)
			description.push(
				`<:_:${
					data.bloonModifiers.speedMultiplier < 1 ? '947454221903613982' : '947454217566715944'
				}> Bloon speed: ${Math.round(data.bloonModifiers.speedMultiplier * 100)}%`
			);

		if (data.bloonModifiers.moabSpeedMultiplier !== 1)
			description.push(
				`<:_:${
					data.bloonModifiers.moabSpeedMultiplier < 1 ? '947454215587000340' : '947454219907125258'
				}> Moab speed: ${Math.round(data.bloonModifiers.moabSpeedMultiplier * 100)}%`
			);

		if (data.bloonModifiers.healthMultipliers.bloons !== 1)
			description.push(
				`<:_:${
					data.bloonModifiers.healthMultipliers.bloons < 1
						? '947456989150199859'
						: '947456989208932382'
				}> Ceramic health: ${Math.round(data.bloonModifiers.healthMultipliers.bloons * 100)}%`
			);

		if (data.bloonModifiers.healthMultipliers.moabs !== 1)
			description.push(
				`<:_:${
					data.bloonModifiers.healthMultipliers.moabs < 1
						? '947459371154178098'
						: '947459368473989130'
				}> Moab health: ${Math.round(data.bloonModifiers.healthMultipliers.moabs * 100)}%`
			);

		if (data.bloonModifiers.regrowRateMultiplier && data.bloonModifiers.regrowRateMultiplier !== 1)
			description.push(
				`<:_:${
					data.bloonModifiers.regrowRateMultiplier < 1 ? '947460169372143686' : '947460169699307520'
				}> Regrow rate: ${Math.round(data.bloonModifiers.regrowRateMultiplier * 100)}%`
			);

		if (data.abilityCooldownReductionMultiplier && data.abilityCooldownReductionMultiplier !== 1)
			description.push(
				`<:_:${
					data.abilityCooldownReductionMultiplier < 1 ? '947462092661862420' : '947462070721454160'
				}> Ability cooldown: ${Math.round(data.abilityCooldownReductionMultiplier * 100)}%`
			);

		if (data.removeableCostMultiplier === 0)
			description.push(`<:_:947462619835535451> Free removal`);
		else if (data.removeableCostMultiplier === 12)
			description.push(`<:_:947462621060280330> Removal disabled`);
		else if (data.removeableCostMultiplier && data.removeableCostMultiplier !== 1)
			description.push(
				`<:_:${
					data.removeableCostMultiplier < 1 ? '947462621060280330' : '947462619835535451'
				}> Removal cost: ${Math.round(data.removeableCostMultiplier * 100)}%`
			);

		if (data.leastCashUsed && data.leastCashUsed > -1)
			description.push(`<:_:964440130221928498> Cash limit: $${data.leastCashUsed}`);

		if (data.leastTiersUsed && data.leastTiersUsed > -1)
			description.push(`<:_:964440130481963048> Tier limit: ${data.leastTiersUsed}`);

		if (data.maxTowers !== -1)
			description.push(`<:_:948162885694148608> Max towers: ${data.maxTowers}`);

		embed.description = description.join('\n');

		const startRules = { ...data.startRules };

		if (startRules.lives === -1) {
			if (data.difficulty === 'Easy') startRules.lives = 200;
			if (data.difficulty === 'Medium') startRules.lives = 150;
			if (data.difficulty === 'Hard') startRules.lives = 50;
			if (data.mode === 'Chimps' || data.mode === 'Impoppable') startRules.lives = 1;
		}

		if (startRules.maxLives === -1) {
			startRules.maxLives = 5000;

			if (data.mode === 'Chimps' || data.mode === 'Impoppable') startRules.maxLives = 1;
		}

		if (startRules.cash === -1) {
			startRules.cash = 650;

			if (data.mode === 'Deflation') startRules.cash = 20000;
		}

		if (startRules.round === -1) {
			startRules.round = 1;

			if (data.difficulty === 'Hard') startRules.round = 3;
			if (data.mode === 'Deflation') startRules.round = 31;
			if (data.mode === 'Chimps' || data.mode === 'Impoppable') startRules.round = 6;
		}

		if (startRules.endRound === -1) {
			if (data.difficulty === 'Easy') startRules.endRound = 40;
			if (data.difficulty === 'Medium') startRules.endRound = 60;
			if (data.difficulty === 'Hard') startRules.endRound = 80;
			if (data.mode === 'Deflation') startRules.round = 60;
			if (data.mode === 'Chimps' || data.mode === 'Impoppable') startRules.endRound = 100;
		}

		embed.fields = [
			{
				name: 'Lives',
				value: `${startRules.lives}/${startRules.maxLives}`,
				inline: true,
			},
			{
				name: 'Cash',
				value: `$${startRules.cash}`,
				inline: true,
			},
			{
				name: 'Round(s)',
				value: `${startRules.round}-${startRules.endRound}`,
				inline: true,
			},
		];

		getTowers(data.towers).forEach(
			([category, towers]) =>
				towers &&
				embed.fields?.push({
					name: category,
					value: towers,
				})
		);

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: '',
				embeds: [embed],
			},
		};
	},
];

const spacePascalCase = (str: string) => str.replace(/([A-Z])/g, ' $1').trim();

const getTowers = (towers: Tower[]) => {
	towers = towers.filter((tower) => tower.max !== 0);

	towers.forEach((tower) => {
		tower.tower = tower.tower
			.replace(/Monkey|Shooter|Pilot|Gunner/g, '')
			.replace(/([a-z])([A-Z])/g, '$1 $2')
			.trim();

		tower.path1NumBlockedTiers = 5 - tower.path1NumBlockedTiers;
		tower.path2NumBlockedTiers = 5 - tower.path2NumBlockedTiers;
		tower.path3NumBlockedTiers = 5 - tower.path3NumBlockedTiers;

		if (tower.path1NumBlockedTiers === 6) tower.path1NumBlockedTiers = 0;
		if (tower.path2NumBlockedTiers === 6) tower.path2NumBlockedTiers = 0;
		if (tower.path3NumBlockedTiers === 6) tower.path3NumBlockedTiers = 0;

		if (isNaN(tower.path1NumBlockedTiers)) tower.path1NumBlockedTiers = 5;
		if (isNaN(tower.path2NumBlockedTiers)) tower.path2NumBlockedTiers = 5;
		if (isNaN(tower.path3NumBlockedTiers)) tower.path3NumBlockedTiers = 5;
	});

	const towerOrder = [
		'Dart',
		'Boomerang',
		'Bomb',
		'Tack',
		'Ice',
		'Glue',
		'Sniper',
		'Sub',
		'Buccaneer',
		'Ace',
		'Heli',
		'Mortar',
		'Dartling',
		'Wizard',
		'Super',
		'Ninja',
		'Alchemist',
		'Druid',
		'Farm',
		'Spactory',
		'Village',
		'Engineer',
	];

	towers.sort((a, b) => towerOrder.indexOf(a.tower) - towerOrder.indexOf(b.tower));

	const primary = towers.filter(({ tower }) =>
		['Dart', 'Boomerang', 'Bomb', 'Tack', 'Ice', 'Glue'].includes(tower)
	);

	const military = towers.filter(({ tower }) =>
		['Sniper', 'Sub', 'Buccaneer', 'Ace', 'Heli', 'Mortar', 'Dartling'].includes(tower)
	);

	const magic = towers.filter(({ tower }) =>
		['Wizard', 'Super', 'Ninja', 'Alchemist', 'Druid'].includes(tower)
	);

	const support = towers.filter(({ tower }) =>
		['Farm', 'Spactory', 'Village', 'Engineer'].includes(tower)
	);

	return [
		[
			'Hero(s)',
			spacePascalCase(
				towers
					.filter((t) => t.isHero)
					.map((t) => t.tower)
					.join(', ')
			),
		],
		['Primary', primary.map(stringifyCrosspath).join(', ')],
		['Military', military.map(stringifyCrosspath).join(', ')],
		['Magic', magic.map(stringifyCrosspath).join(', ')],
		['Support', support.map(stringifyCrosspath).join(', ')],
	];
};

const stringifyCrosspath = ({
	tower,
	max,
	path1NumBlockedTiers,
	path2NumBlockedTiers,
	path3NumBlockedTiers,
}: Tower) =>
	`${max > 0 ? `${max}x ` : ''}**${tower.toLowerCase()}**${
		[path1NumBlockedTiers, path2NumBlockedTiers, path3NumBlockedTiers].some((count) => count !== 5)
			? ` (${path1NumBlockedTiers}-${path2NumBlockedTiers}-${path3NumBlockedTiers})`
			: ''
	}`;

const gamemodeIcons: Record<string, string> = {
	Deflation: '692f69b2239e6e7c58530d24e05e50f1',
	Reverse: 'fad8916ca6638c5f8ccacc0c3c89aa48',
	Apopalypse: 'fa276e92d0827bc2032f21f1a5cc6f29',
	DoubleMoabHealth: 'c0639b69078970041dee23d92daf0b13',
	HalfCash: '50a88ece1c58ae5ee742a4672a5559bf',
	AlternateBloonsRounds: 'd7bba9962f2d1307a316aa2eebfcd8e9',
	Impoppable: '7b7f57b101cdc8c682d1c5c3654687df',
	Chimps: 'e739a2ca6afcd40dd20c099d226b31fd',
	Standard: 'f3d3fb46de3c4c6f791cd1b6fe9b60dd',
};

const difficultyIcons: Record<string, string> = {
	Easy: 'fa0dc0d42855ce8fc7920eec06ede956',
	Medium: '08e5b02e88d6d4c50e75d6e433db359challenge',
	Hard: '6e6137d23ad90d5df01ddd4baf1ac36e',
};

export default command;
