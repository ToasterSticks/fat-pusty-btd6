import { APIChatInputApplicationCommandInteractionData, APIEmbed } from 'discord-api-types/v10';

import { BloonsChallengeData, Stats, Tower } from './types';

export const OWNERS = ['320546614857170945'];

export const capitalize = (str: string) => str[0].toUpperCase() + str.substring(1);

export const addNumberSeparator = (num: number) => {
	const digits = (Math.log(num) * Math.LOG10E + 1) | 0;
	return digits > 4 ? num.toLocaleString() : num.toString();
};

export const getOption = (data: APIChatInputApplicationCommandInteractionData, name: string) => {
	const option = data.options?.find((option) => option.name === name);

	if (!option) return null;

	return 'value' in option ? option.value : null;
};

export const generateChallengeEmbed = ({
	data,
	id,
	type,
	stats,
}: {
	data: BloonsChallengeData;
	id?: string;
	type?: 'Daily' | 'Advanced';
	stats?: Stats;
}): APIEmbed => {
	if (data.map === 'Tutorial') data.map = 'MonkeyMeadow';
	if (data.map === 'TownCentre') data.map = 'TownCenter';
	if (data.mode === 'Clicks') data.mode = 'Chimps';

	const embed: APIEmbed = {
		color: 13296619,
		title: data.name,
		url: !type && id ? `https://join.btd6.com/Challenge/${id}` : undefined,
		thumbnail: {
			url: `https://i.gyazo.com/${id ? gamemodeIcons[data.mode] : bossIcons[data.name]}.png`,
		},
		author: id
			? {
					name: type ? `${type} data #${id}` : id,
					icon_url: `https://i.gyazo.com/${difficultyIcons[data.difficulty]}.png`,
			  }
			: undefined,
		description: `${spacePascalCase(data.map)} - ${data.difficulty} - ${spacePascalCase(
			data.mode
		)}`,
		fields: [],
	};

	if (stats) {
		const attempts = stats.plays + stats.restarts;

		embed.fields?.push({
			name: 'Stats',
			value: [
				`Attempts: ${addNumberSeparator(attempts)}`,
				`Wins: ${addNumberSeparator(stats.wins)}`,
				`Fails: ${addNumberSeparator(attempts - stats.wins)}`,
				`Unique players: ${addNumberSeparator(stats.playsUnique)}`,
				`Victorious players: ${addNumberSeparator(stats.winsUnique)}`,
				`Completion rate: ${Math.round((stats.winsUnique / stats.playsUnique) * 100)}%`,
				`Win rate: ${Math.round((stats.wins / attempts) * 100)}%`,
			].join('\n'),
		});
	}

	const modifiers: string[] = [];

	if (data.disableSelling) modifiers.push('<:_:947206526018387999> Selling disabled');
	if (data.disableMK) modifiers.push('<:_:947206527721291786> Knowledge disabled');
	if (data.bloonModifiers.allCamo) modifiers.push('<:_:947206526765002843> All camo');
	if (data.bloonModifiers.allRegen) modifiers.push('<:_:947206530162376804> All regrow ');

	if (data.bloonModifiers.speedMultiplier !== 1)
		modifiers.push(
			`<:_:${
				data.bloonModifiers.speedMultiplier < 1 ? '947454221903613982' : '947454217566715944'
			}> Bloon speed: ${addNumberSeparator(Math.round(data.bloonModifiers.speedMultiplier * 100))}%`
		);

	if (data.bloonModifiers.moabSpeedMultiplier !== 1)
		modifiers.push(
			`<:_:${
				data.bloonModifiers.moabSpeedMultiplier < 1 ? '947454215587000340' : '947454219907125258'
			}> Moab speed: ${Math.round(data.bloonModifiers.moabSpeedMultiplier * 100)}%`
		);

	if (data.bloonModifiers.healthMultipliers.bloons !== 1)
		modifiers.push(
			`<:_:${
				data.bloonModifiers.healthMultipliers.bloons < 1
					? '947456989150199859'
					: '947456989208932382'
			}> Ceramic health: ${Math.round(data.bloonModifiers.healthMultipliers.bloons * 100)}%`
		);

	if (data.bloonModifiers.healthMultipliers.moabs !== 1)
		modifiers.push(
			`<:_:${
				data.bloonModifiers.healthMultipliers.moabs < 1
					? '947459371154178098'
					: '947459368473989130'
			}> Moab health: ${Math.round(data.bloonModifiers.healthMultipliers.moabs * 100)}%`
		);

	if (data.bloonModifiers.regrowRateMultiplier && data.bloonModifiers.regrowRateMultiplier !== 1)
		modifiers.push(
			`<:_:${
				data.bloonModifiers.regrowRateMultiplier < 1 ? '947460169372143686' : '947460169699307520'
			}> Regrow rate: ${Math.round(data.bloonModifiers.regrowRateMultiplier * 100)}%`
		);

	if (data.abilityCooldownReductionMultiplier && data.abilityCooldownReductionMultiplier !== 1)
		modifiers.push(
			`<:_:${
				data.abilityCooldownReductionMultiplier < 1 ? '947462092661862420' : '947462070721454160'
			}> Ability cooldown: ${Math.round(data.abilityCooldownReductionMultiplier * 100)}%`
		);

	if (data.removeableCostMultiplier === 0) modifiers.push(`<:_:947462619835535451> Free removal`);
	else if (data.removeableCostMultiplier === 12)
		modifiers.push(`<:_:947462621060280330> Removal disabled`);
	else if (data.removeableCostMultiplier && data.removeableCostMultiplier !== 1)
		modifiers.push(
			`<:_:${
				data.removeableCostMultiplier < 1 ? '947462621060280330' : '947462619835535451'
			}> Removal cost: ${Math.round(data.removeableCostMultiplier * 100)}%`
		);

	if (data.leastCashUsed && data.leastCashUsed > -1)
		modifiers.push(`<:_:964440130221928498> Cash limit: $${data.leastCashUsed}`);

	if (data.leastTiersUsed && data.leastTiersUsed > -1)
		modifiers.push(`<:_:964440130481963048> Tier limit: ${data.leastTiersUsed}`);

	if (data.maxTowers !== -1)
		modifiers.push(`<:_:948162885694148608> Max towers: ${data.maxTowers}`);

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

	const isSingleRound = startRules.round === startRules.endRound;

	if (modifiers.length)
		embed.fields?.push({
			name: `Modifier${modifiers.length > 1 ? 's' : ''}`,
			value: modifiers.join('\n'),
		});

	embed.fields?.push(
		{
			name: 'Lives',
			value: `${addNumberSeparator(startRules.lives)}/${addNumberSeparator(startRules.maxLives)}`,
			inline: true,
		},
		{
			name: 'Cash',
			value: `$${addNumberSeparator(startRules.cash)}`,
			inline: true,
		},
		{
			name: `Round${!isSingleRound ? 's' : ''}`,
			value: isSingleRound
				? startRules.round.toString()
				: `${startRules.round}-${startRules.endRound}`,
			inline: true,
		}
	);

	getTowers(data.towers).forEach(
		([category, towers]) =>
			towers &&
			embed.fields?.push({
				name: category,
				value: towers,
			})
	);

	return embed;
};

const spacePascalCase = (str: string) => str.replace(/([A-Z])/g, ' $1').trim();

const getTowers = (towers: Tower[]) => {
	towers = towers.filter((tower) => tower.max !== 0);

	towers.forEach((tower) => {
		tower.tower = spacePascalCase(tower.tower.replace(/Monkey|Shooter|Pilot|Gunner|Banana/g, ''));

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

	const heroOrder = [
		'Quincy',
		'Gwendolin',
		'Striker Jones',
		'Obyn Greenfoot',
		'Geraldo',
		'Captain Churchill',
		'Benjamin',
		'Ezili',
		'Pat Fusty',
		'Adora',
		'Admiral Brickell',
		'Etienne',
		'Sauda',
		'Psi',
	];

	const priOrder = ['Dart', 'Boomerang', 'Bomb', 'Tack', 'Ice', 'Glue'];
	const milOrder = ['Sniper', 'Sub', 'Buccaneer', 'Ace', 'Heli', 'Mortar', 'Dartling'];
	const magOrder = ['Wizard', 'Super', 'Ninja', 'Alchemist', 'Druid'];
	const supOrder = ['Farm', 'Spike Factory', 'Village', 'Engineer'];

	towers.sort((a, b) => {
		const towerOrder = [...heroOrder, ...priOrder, ...milOrder, ...magOrder, ...supOrder];
		return towerOrder.indexOf(a.tower) - towerOrder.indexOf(b.tower);
	});

	const primary = towers.filter(({ tower }) => priOrder.includes(tower));
	const military = towers.filter(({ tower }) => milOrder.includes(tower));
	const magic = towers.filter(({ tower }) => magOrder.includes(tower));
	const support = towers.filter(({ tower }) => supOrder.includes(tower));
	const heroes = towers.filter((tower) => tower.isHero);

	return [
		[`Hero${heroes.length !== 1 ? 'es' : ''}`, heroes.map((t) => t.tower).join(', ')],
		['Primary', primary.map(stringifyCrosspath).join('\n')],
		['Military', military.map(stringifyCrosspath).join('\n')],
		['Magic', magic.map(stringifyCrosspath).join('\n')],
		['Support', support.map(stringifyCrosspath).join('\n')],
	];
};

const stringifyCrosspath = ({
	tower,
	max,
	path1NumBlockedTiers,
	path2NumBlockedTiers,
	path3NumBlockedTiers,
}: Tower) =>
	`${
		max > 0 ? `${max}x ` : ''
	}${tower} \`(${`${path1NumBlockedTiers}-${path2NumBlockedTiers}-${path3NumBlockedTiers}`})\``;

const bossIcons: Record<string, string> = {
	'Bloonarius Normal': 'd7c187d0b125443079d5b41e822e7214',
	'Bloonarius Elite': '177b43d651bf8fcb5dc01c75b0a066b9',
	'Lych Normal': '761c68a031bb5169416bed0036f56301',
	'Lych Elite': '7e857296728f236ecba6c6f2ddd25ad7',
	'Vortex Normal': '9baf65029709fe34eda0775436d32c6c',
	'Vortex Elite': '4d0beb6dd632fde0e61cb7d959e0352b',
};

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
	Medium: '08e5b02e88d6d4c50e75d6e433db359d',
	Hard: '6e6137d23ad90d5df01ddd4baf1ac36e',
};
