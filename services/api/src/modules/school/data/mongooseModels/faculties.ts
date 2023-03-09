import { FacultyDbChangeCallbacks } from '../../utils/changes/faculties'
import { appInstance } from '@utils/types'
import { FacultyMapper } from '../mappers/faculties'
import { FacultyFromModel } from '../models/faculties'

const Schema = new appInstance.dbs.mongo.Schema<FacultyFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	name: {
		type: String,
		required: true
	},
	institutionId: {
		type: String,
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

export const Faculty = appInstance.dbs.mongo.use('school').model<FacultyFromModel>('Faculty', Schema)

export const FacultyChange = appInstance.dbs.mongo.change(Faculty, FacultyDbChangeCallbacks, new FacultyMapper().mapFrom)