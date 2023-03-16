export enum RankTypes {
	rookie = 'rookie',
	comrade = 'comrade',
	scholar = 'scholar',
	wizard = 'wizard',
	einstein = 'einstein'
}

type Rank = {
	id: RankTypes
	level: number
	score: number
}

const Ranks: Record<RankTypes, Rank> = {
	[RankTypes.rookie]: {
		id: RankTypes.rookie,
		level: 1,
		score: 100
	},
	[RankTypes.comrade]: {
		id: RankTypes.comrade,
		level: 2,
		score: 250
	},
	[RankTypes.scholar]: {
		id: RankTypes.scholar,
		level: 3,
		score: 600
	},
	[RankTypes.wizard]: {
		id: RankTypes.wizard,
		level: 4,
		score: 1500
	},
	[RankTypes.einstein]: {
		id: RankTypes.einstein,
		level: 5,
		score: Number.POSITIVE_INFINITY
	}
}

export const ranks = Object.values(Ranks).sort((a, b) => a.level - b.level)

export const getRank = (score: number) => ranks.find((r) => score < r.score) ?? Ranks[RankTypes.rookie]

export const getNextRank = (rank: RankTypes): Rank | null => {
	const index = ranks.findIndex((r) => r.id === rank)
	return ranks[index + 1] ?? null
}