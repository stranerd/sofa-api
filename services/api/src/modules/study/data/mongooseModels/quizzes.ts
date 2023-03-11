import { appInstance } from '@utils/types'
import { QuizDbChangeCallbacks } from '../../utils/changes/quizzes'
import { QuizMapper } from '../mappers/quizzes'
import { QuizFromModel } from '../models/quizzes'

const Schema = new appInstance.dbs.mongo.Schema<QuizFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: false,
		default: ''
	},
	photo: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: null
	},
	isPublic: {
		type: Boolean,
		required: false,
		default: false
	},
	questions: {
		type: [String],
		required: true
	},
	user: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	tagId: {
		type: String,
		required: true
	},
	price: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
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

export const Quiz = appInstance.dbs.mongo.use('study').model<QuizFromModel>('Quiz', Schema)

export const QuizChange = appInstance.dbs.mongo.change(Quiz, QuizDbChangeCallbacks, new QuizMapper().mapFrom)