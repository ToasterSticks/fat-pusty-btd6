declare global {
	const CLIENT_ID: string;
	const CLIENT_SECRET: string;
	const PUBLIC_KEY: string;
}

export interface BloonsChallengeData {
	towers: Tower[];
	map: string;
	difficulty: string;
	rewards: string;
	mode: string;
	id: number;
	maxTowers: number;
	bloonModifiers: BloonModifiers;
	disableMK: boolean;
	disableSelling: boolean;
	disablePowers: boolean;
	noContinues: boolean;
	noInstaReward: boolean;
	startRules: StartRules;
	name: string;
	displayIncludedTowers: boolean;
	seed: number;
	numberOfPlayers: number;
	coopDivisionType: number | string;
	replaces?: null;
	powers?: Power[];
	maxPowers?: number;
	removeableCostMultiplier?: number;
	abilityCooldownReductionMultiplier?: number;
	roundSets?: null;
	disableDoubleCash?: boolean;
	displayIncludedPowers?: boolean;
	leastCashUsed?: number;
	leastTiersUsed?: number;
	ignoreLeastMode?: boolean;
}

export interface BloonModifiers {
	speedMultiplier: number;
	moabSpeedMultiplier: number;
	healthMultipliers: HealthMultipliers;
	allCamo: boolean;
	allRegen: boolean;
	regrowRateMultiplier?: number;
}

export interface HealthMultipliers {
	bloons: number;
	moabs: number;
}

export interface Power {
	power: string;
	max: number;
}

export interface StartRules {
	lives: number;
	maxLives: number;
	cash: number;
	round: number;
	endRound: number;
}

export interface Tower {
	tower: string;
	max: number;
	path1NumBlockedTiers: number;
	path2NumBlockedTiers: number;
	path3NumBlockedTiers: number;
	isHero: boolean;
}
