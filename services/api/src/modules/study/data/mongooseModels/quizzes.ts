import { appInstance } from '@utils/types'
import { CoursableDataSchema } from '.'
import { QuizMeta } from '../../domain/types'
import { QuizDbChangeCallbacks } from '../../utils/changes/quizzes'
import { QuizMapper } from '../mappers/quizzes'
import { QuizFromModel } from '../models/quizzes'

const Schema = new appInstance.dbs.mongo.Schema<QuizFromModel>({
	...CoursableDataSchema,
	questions: {
		type: [String],
		required: true
	},
	access: {
		members: {
			type: [String],
			required: false,
			default: () => []
		},
		requests: {
			type: [String],
			required: false,
			default: () => []
		}
	},
	meta: Object.fromEntries(
		Object.values(QuizMeta).map((meta) => [meta, {
			type: Number,
			required: false,
			default: 0
		}])
	),
	isForTutors: {
		type: Boolean,
		required: false,
		default: false
	}
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const Quiz = appInstance.dbs.mongo.use('study').model<QuizFromModel>('Quiz', Schema)

export const QuizChange = appInstance.dbs.mongo.change(Quiz, QuizDbChangeCallbacks, new QuizMapper().mapFrom)