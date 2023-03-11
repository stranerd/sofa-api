import { appInstance } from '@utils/types'
import { QuestionDbChangeCallbacks } from '../../utils/changes/questions'
import { QuestionMapper } from '../mappers/questions'
import { QuestionFromModel } from '../models/questions'

const Schema = new appInstance.dbs.mongo.Schema<QuestionFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	userId: {
		type: String,
		required: true
	},
	quizId: {
		type: String,
		required: true
	},
	question: {
		type: String,
		required: false,
		default: ''
	},
	questionMedia: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: null
	},
	createdAt: {
		type: Number,
		required: false,
		default: Date.now
	},
	updatedAt: {
		type: Number,
		required: false,
		default: Date.now
	}
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const Question = appInstance.dbs.mongo.use('study').model<QuestionFromModel>('Quiz-Question', Schema)

export const QuestionChange = appInstance.dbs.mongo.change(Question, QuestionDbChangeCallbacks, new QuestionMapper().mapFrom)