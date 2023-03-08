export enum RankTypes {
	Rookie = 'Rookie',
	Comrade = 'Comrade',
	Scholar = 'Scholar',
	Wizard = 'Wizard',
	Einstein = 'Einstein'
}

type Rank = {
	id: RankTypes
	level: number
	score: number
}

const Ranks: Record<RankTypes, Rank> = {
	[RankTypes.Rookie]: {
		id: RankTypes.Rookie,
		level: 1,
		score: 100
	},
	[RankTypes.Comrade]: {
		id: RankTypes.Comrade,
		level: 2,
		score: 250
	},
	[RankTypes.Scholar]: {
		id: RankTypes.Scholar,
		level: 3,
		score: 600
	},
	[RankTypes.Wizard]: {
		id: RankTypes.Wizard,
		level: 4,
		score: 1500
	},
	[RankTypes.Einstein]: {
		id: RankTypes.Einstein,
		level: 5,
		score: Number.POSITIVE_INFINITY
	}
}

export const ranks = Object.values(Ranks).sort((a, b) => a.level - b.level)

export const getRank = (score: number) => ranks.find((r) => score < r.score) ?? Ranks[RankTypes.Rookie]

export const getNextRank = (rank: RankTypes): Rank | null => {
	const index = ranks.findIndex((r) => r.id === rank)
	return ranks[index + 1] ?? null
}