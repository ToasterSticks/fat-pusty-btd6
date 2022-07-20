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
	restarts?: number;
	firstWin?: string;
	latestWin?: string;
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

export interface PublicUserProfile {
	playerId: string;
	playerRank: number;
	playerXp: number;
	veteranRank?: number;
	veteranXp?: number;
	avatar: string;
	banner: string;
	gameCount: number;
	gamesWon: number;
	highestRound: number;
	monkeysPlaced: number;
	bloonsPopped: number;
	camosPopped?: number;
	leadsPopped?: number;
	purplesPopped?: number;
	regrowsPopped?: number;
	ceramicsPopped?: number;
	moabsPopped?: number;
	bfbsPopped?: number;
	zomgsPopped?: number;
	ddtsPopped?: number;
	badsPopped?: number;
	bloonsLeaked?: number;
	cashEarned: number;
	instaMonkeysUsed?: number;
	powersUsed?: number;
	abilitiesUsed?: number;
	coopBloonsPopped?: number;
	coopCashGiven?: number;
	achievementsClaimed?: number[];
	achievements?: number[];
	hiddenAchievements?: number[];
	hiddenAchievementsClaimed?: number[];
	heroesPlacedData: { [key: string]: number };
	towersPlacedData: { [key: string]: number };
	spMedals: { [key: string]: number };
	coopMedals: { [key: string]: number };
	raceMedals: Medals;
	bossMedals: Medals;
	bossEliteMedals: Medals;
	bossBadges: { [key: string]: BossBadge };
	dailyRewards?: number;
	challengesCompleted?: number;
	savedStats: { [key: string]: boolean };
	totalOdysseysCompleted?: number;
	totalOdysseyStars?: number;
	totalTrophiesEarned?: number;
	statsVersion: number;
	necroBloonsReanimated?: number;
	transformingTonicsUsed?: number;
	mostExperiencedMonkey?: string;
	mostExperiencedMonkeyXp?: number;
	instaMonkeyCollection?: number;
	collectionChestsOpened?: number;
	goldenBloonsPopped?: number;
	monkeyTeamsWins?: number;
	highestRoundCHIMPS?: number;
	highestRoundDeflation?: number;
}

export interface BossBadge {
	normalBadges: number;
	eliteBadges: number;
}

export interface Medals {
	BlackDiamond?: number;
	RedDiamond?: number;
	Diamond?: number;
	GoldDiamond?: number;
	Gold?: number;
	GoldSilver?: number;
	DoubleSilver?: number;
	Silver?: number;
	Bronze?: number;
}
