import {
	ApplicationCommand,
	ApplicationCommandOptionType,
	Interaction,
	InteractionHandler,
	InteractionResponse,
	InteractionResponseType,
} from 'cloudflare-discord-bot';

const command: [ApplicationCommand, InteractionHandler] = [
	{
		name: 'reddit',
		description: 'Fetch the hottest BTD6 posts',
		options: [
			{
				name: 'subreddit',
				description: 'The subreddit to fetch posts from',
				type: ApplicationCommandOptionType.STRING,
			},
		],
	},
	async (interaction: Interaction): Promise<InteractionResponse> => {
		const { data } = await fetch(
			`https://www.reddit.com/r/${interaction.data?.options?.[0].value ?? 'btd6'}/hot.json`
		)
			.then((res) => res.json() as Promise<RedditResponse>)
			.catch(() => ({ data: null }));

		if (!data)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'There was an error while fetching posts for this subreddit.',
					// @ts-expect-error ephemeral
					flags: 1 << 6,
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
];

interface RedditResponse {
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

export default command;
