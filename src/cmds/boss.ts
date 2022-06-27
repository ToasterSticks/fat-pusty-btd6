import { ApplicationCommandOptionType, InteractionResponseType } from 'discord-api-types/v10';

import { BloonsBossData, SlashCommand } from '../types';
import { generateEmbed } from './challenge';

const command: SlashCommand = [
	{
		name: 'boss',
		description: 'Display the current boss event details',
		options: [
			{
				name: 'elite',
				description: 'Whether to display the elite boss',
				type: ApplicationCommandOptionType.Boolean,
			},
		],
	},
	async ({ data }) => {
		const { normalDcm, eliteDcm, bossType } = (await fetch(
			'https://fast-static-api.nkstatic.com/storage/static/appdocs/11/bossData/Bloonarius26'
		).then((res) => res.json())) as BloonsBossData;

		normalDcm.name = `${capitalize(bossType)} Normal`;
		eliteDcm.name = `${capitalize(bossType)} Elite`;

		const isElite =
			data.options?.[0].type === ApplicationCommandOptionType.Boolean && data.options[0].value;

		const embed = generateEmbed(isElite ? eliteDcm : normalDcm);

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: '',
				embeds: [embed],
			},
		};
	},
];

const capitalize = (str: string) => str[0].toUpperCase() + str.substring(1);

export default command;
