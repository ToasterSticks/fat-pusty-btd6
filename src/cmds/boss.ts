import { APIInteractionResponse, InteractionResponseType } from 'discord-api-types/v10';

import { BloonsBossData, SlashCommand } from '../types';
import { generateEmbed } from './challenge';

const command: SlashCommand = [
	{
		name: 'boss',
		description: 'Display the current boss event details',
	},
	async (): Promise<APIInteractionResponse> => {
		const { normalDcm, eliteDcm, bossType } = (await fetch(
			'https://fast-static-api.nkstatic.com/storage/static/appdocs/11/bossData/Bloonarius26'
		).then((res) => res.json())) as BloonsBossData;

		normalDcm.name = `${capitalize(bossType)} Normal`;
		eliteDcm.name = `${capitalize(bossType)} Elite`;

		const embeds = [normalDcm, eliteDcm].map((data) => generateEmbed(data));

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: '',
				embeds,
			},
		};
	},
];

const capitalize = (str: string) => str[0].toUpperCase() + str.substring(1);

export default command;
