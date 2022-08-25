import { Command } from '../http-interactions';
import {
	ApplicationCommandType,
	InteractionResponseType,
	MessageFlags,
} from 'discord-api-types/v10';

import { RedditResponse } from '../types';

export const command: Command<ApplicationCommandType.ChatInput> = {
	name: 'reddit',
	description: 'Fetch the hottest BTD6 posts',

	handler: async () => {
		const { data } = await fetch(`https://www.reddit.com/r/btd6/hot.json`)
			.then((res) => res.json() as Promise<RedditResponse>)
			.catch(() => ({ data: null }));

		if (!data)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'There was an error while fetching posts for this subreddit.',
					flags: MessageFlags.Ephemeral,
				},
			};

		const posts = data.children
			.map((post) => {
				if (post.is_gallery || post.over_18) return '';

				return (
					post.data?.media?.reddit_video?.fallback_url ||
					post.data?.secure_media?.reddit_video?.fallback_url ||
					post.data?.url
				);
			})
			.filter((post) => post);

		const randomIndex = Math.floor(Math.random() * posts.length);
		const randomPost = posts[randomIndex];

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { content: randomPost },
		};
	},
};
