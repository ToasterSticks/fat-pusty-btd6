import pingCommand from './ping';
import redditCommand from './reddit';
import challengeCommand from './challenge';
import inviteCommand from './invite';
import dailyChallengeCommand from './daily';
import bossCommand from './boss';
import setBossCommand from './set-boss';

export const commands = [
	pingCommand,
	redditCommand,
	challengeCommand,
	inviteCommand,
	dailyChallengeCommand,
	bossCommand,
	setBossCommand,
];

export const components = {
	boss: bossCommand,
};
