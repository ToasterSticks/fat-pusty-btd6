import pingCommand from './ping';
import redditCommand from './reddit';
import challengeCommand from './challenge';
import inviteCommand from './invite';
import dailyChallengeCommand from './daily';
import bossCommand from './boss';

export const commands = [
	pingCommand,
	redditCommand,
	challengeCommand,
	inviteCommand,
	dailyChallengeCommand,
	bossCommand,
];

export const components = {
	boss: bossCommand,
};
