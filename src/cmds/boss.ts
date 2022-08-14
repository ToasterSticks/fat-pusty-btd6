import {
	APIButtonComponent,
	APIChatInputApplicationCommandGuildInteraction,
	ApplicationCommandOptionType,
	ButtonStyle,
	ComponentType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { BloonsBossData, CommandBody } from '../types';
import { capitalize, generateChallengeEmbed, getEvents, getOption } from '../util';

export const command: CommandBody = {
	name: 'boss',
	description: 'Display the current boss event details',
	options: [
		{
			name: 'elite',
			description: 'Whether to display the elite boss',
			type: ApplicationCommandOptionType.Boolean,
		},
	],
	handler: async ({ data: { options } }, isElite?: boolean) => {
		const [boss] = await getEvents('bossBloon');
		console.log(isElite);

		const { normalDcm, eliteDcm, bossType } = (await fetch(
			`https://fast-static-api.nkstatic.com/storage/static/appdocs/11/bossData/${boss?.name}`
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

		isElite ??= getOption<boolean>(options, 'elite');

		const embed = generateChallengeEmbed({ data: isElite ? eliteDcm : normalDcm });

		const button: APIButtonComponent = {
			type: ComponentType.Button,
			style: ButtonStyle.Secondary,
			label: `${isElite ? 'Normal' : 'Elite'} mode`,
			custom_id: 'toggle-mode',
		};

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				embeds: [embed],
				components: [{ type: ComponentType.ActionRow, components: [button] }],
			},
		};
	},
	components: {
		'toggle-mode': async (interaction) => {
			const isElite = interaction.message.embeds[0].title?.endsWith('Elite');

			const content = await command.handler(
				{ data: {} } as APIChatInputApplicationCommandGuildInteraction,
				!isElite
			);

			content.type = InteractionResponseType.UpdateMessage;

			return content;
		},
	},
};
