import { appInstance } from '@utils/types'
import { CoursableDataSchema } from '.'
import { QuizDbChangeCallbacks } from '../../utils/changes/quizzes'
import { QuizMapper } from '../mappers/quizzes'
import { QuizFromModel } from '../models/quizzes'

const Schema = new appInstance.dbs.mongo.Schema<QuizFromModel>({
	...CoursableDataSchema,
	questions: {
		type: [String],
		required: true
	}
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const Quiz = appInstance.dbs.mongo.use('study').model<QuizFromModel>('Quiz', Schema)

export const QuizChange = appInstance.dbs.mongo.change(Quiz, QuizDbChangeCallbacks, new QuizMapper().mapFrom)