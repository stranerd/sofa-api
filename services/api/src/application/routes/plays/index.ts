import { PlaysUseCases } from '@modules/plays'
import { Play } from '@modules/plays/data/mongooseModels/plays'
import { QuestionsUseCases } from '@modules/study'
import { Conditions, groupRoutes } from 'equipped'
import { answersRoutes } from './answers'
import { playsRoutes } from './plays'

export const playRoutes = groupRoutes({ path: '/plays' }, [
	...playsRoutes,
	...answersRoutes,
	{
		path: '/fix-comp-questions',
		method: 'get',
		handler: async () => {
			const userId = '67d833825b7a0990eb86f7f5'
			const plays = await PlaysUseCases.get({
				where: [{ field: 'user.id', value: userId }],
				all: true,
			})

			const questionIds = plays.results.flatMap((p) => p.questions)
			const questions = await QuestionsUseCases.get({
				where: [{ field: 'id', value: questionIds, condition: Conditions.in }],
				all: true,
			})

			const questionsMap = Object.fromEntries(questions.results.map((q) => [q.id, q]))

			await Play.bulkWrite(
				plays.results.map((p) => {
					const sources = p.sources.map((s) => questionsMap[s.id]).filter(Boolean)
					return {
						updateOne: {
							filter: { _id: p.id },
							update: { $set: { sources } },
						},
					}
				}),
			)
		},
	},
])
