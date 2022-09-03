import { Command } from '../http-interactions';
import {
	APIButtonComponent,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ButtonStyle,
	ComponentType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { BloonsBossData } from '../types';
import {
	capitalize,
	castInteraction,
	deferUpdate,
	generateChallengeEmbed,
	getEvents,
	getOption,
} from '../util';

export const command: Command<ApplicationCommandType.ChatInput> = {
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
		const [boss] = await getEvents('bossBloon'),
			{ normalDcm, eliteDcm, bossType } = (await fetch(
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

		const embed = generateChallengeEmbed({ data: isElite ? eliteDcm : normalDcm }),
			button: APIButtonComponent = {
				type: ComponentType.Button,
				style: ButtonStyle.Secondary,
				label: `${isElite ? 'Normal' : 'Elite'} Mode`,
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
			if (interaction.member!.user.id !== interaction.message.interaction?.user.id)
				return deferUpdate();

			const isElite = interaction.message.embeds[0].title?.endsWith('Elite'),
				content = await command.handler(castInteraction(interaction), !isElite);
			content.type = InteractionResponseType.UpdateMessage;

			return content;
		},
	},
};
