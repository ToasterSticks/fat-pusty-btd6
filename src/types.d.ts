import {
	APIChatInputApplicationCommandGuildInteraction,
	APIInteractionResponse,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';

declare global {
	const CLIENT_ID: string;
	const CLIENT_SECRET: string;
	const PUBLIC_KEY: string;

	const KV: KVNamespace;
}

export type SlashCommand = [
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	(
		interaction: APIChatInputApplicationCommandGuildInteraction
	) => Promise<APIInteractionResponse> | APIInteractionResponse
];

export interface BloonsBossData {
	normalDcm: BloonsChallengeData;
	eliteDcm: BloonsChallengeData;
	bossType: 'bloonarius' | 'lych' | 'vortex';
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

export interface RedditResponse {
	kind: string;
	data: {
		after: string;
		dist: number;
		modhash: string;
		geo_filter: null;
		// eslint-disable-next-line
		children: any[];
		before: null;
	};
}

export interface AuthorizedChallengeData {
	total: number;
	next: number;
	found: number;
	results: Result[];
	cached: boolean;
}

export interface Result {
	id: string;
	owner: string;
	challengeName: string;
	map: string;
	gameVersionNumber: number;
	gameVersion: string;
	latestVersionBeaten: number;
	stats: Stats;
	pageFile: boolean;
	isUnlosable: boolean;
	isUnwinable: boolean;
	isDeleted: boolean;
	properties: Properties;
	odysseyDifficulty: number;
	createdAt: number;
}

export interface Properties {
	startRound: number;
	endRound: number;
	isExtreme: boolean;
}

export interface Stats {
	plays: number;
	playsUnique: number;
	wins: number;
	winsUnique: number;
	losses: number;
	lossesUnique: number;
	upvotes: number;
	restarts: number;
	firstWin?: string;
	latestWin?: string;
	creator: string;
}

export interface AuthorizedUserData {
	users: Record<string, Profile>;
}

export interface Profile {
	nkapiID: string;
	displayName: string;
	clan: number;
	country: string;
	continent: string;
	avatar: number;
	online: boolean;
	onlineApp: number;
	providersAvailable: string[];
	access: number;
	age: number;
	shortcode: string;
	safeName: string;
}
