import {
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { BloonsBossData, SlashCommand } from '../types';
import { capitalize, generateChallengeEmbed, getOption } from '../util';

const command: SlashCommand = {
	name: 'boss',
	description: 'Display the current boss event details',
	options: [
		{
			name: 'elite',
			description: 'Whether to display the elite boss',
			type: ApplicationCommandOptionType.Boolean,
		},
	],
	handler: async ({ data: { options } }) => {
		const id = await KV.get('boss');

		const { normalDcm, eliteDcm, bossType } = (await fetch(
			`https://fast-static-api.nkstatic.com/storage/static/appdocs/11/bossData/${id}`
		)
			.then((res) => res.json())
			.catch(() => ({}))) as BloonsBossData;

		if (!bossType)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'There is no boss event data available.',
					flags: MessageFlags.Ephemeral,
				},
			};

		normalDcm.name = `${capitalize(bossType)} Normal`;
		eliteDcm.name = `${capitalize(bossType)} Elite`;

		const isElite = getOption<boolean>(options, 'elite');

		const embed = generateChallengeEmbed({ data: isElite ? eliteDcm : normalDcm });

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: '',
				embeds: [embed],
			},
		};
	},
};

export default command;
