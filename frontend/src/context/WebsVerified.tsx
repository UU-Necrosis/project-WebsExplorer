export interface ClientSubmission {
	id: string
	name: string
	hash: string
	submittedBy: string
	submittedAt: string
	adminVotes: number[]
	clientVotes: number[]
	url: string
	status: 'Hidden' | 'Visible'
	appearance: string
	description: string
	categories: string[]
	tags: string[]
	username: string
	role: string
}

export const WEBSITES_LIST: ClientSubmission[] = [
	{
		id: '5',
		name: 'Perplexity AI',
		hash: '0xab33...de12',
		submittedBy: 'perplexity',
		submittedAt: '2026-11-06T08:55:00Z',
		adminVotes: [5, 14, 6, 9, 2],
		clientVotes: [ 5, 3, 1],
		url: 'https://perplexity.ai',
		status: 'Visible',
		appearance: 'AI-powered answer and search engine',
		description: 'Perplexity is an AI-powered answer and search engine that provides sourced, helpful responses to questions.',
		categories: ['AI & ML', 'Search'],
		tags: ['AI', 'Search'],
		username: 'perplexity',
		role: 'Admin',
	},
	{
		id: '11',
		name: 'Anthropic',
		hash: '0xab33...de12',
		submittedBy: 'anthropic',
		submittedAt: '2026-11-06T07:30:00Z',
		adminVotes: [7, 11, 15, 9, 3],
		clientVotes: [6, 2, 4],
		url: 'https://anthropic.com',
		status: 'Visible',
		appearance: 'AI safety and research company',
		description: 'Anthropic is an AI research and development company focused on building reliable, interpretable, and steerable AI systems.',
		categories: ['AI & ML', 'Search'],
		tags: ['AI', 'Research'],
		username: 'anthropic',
		role: 'Owner',
	},
]