import { appInstance } from '@utils/types'
import { DepartmentDbChangeCallbacks } from '../../utils/changes/departments'
import { DepartmentMapper } from '../mappers/departments'
import { DepartmentFromModel } from '../models/departments'

const Schema = new appInstance.dbs.mongo.Schema<DepartmentFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	title: {
		type: String,
		required: true
	},
	institutionId: {
		type: String,
		required: true
	},
	facultyId: {
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

export const Department = appInstance.dbs.mongo.use('school').model<DepartmentFromModel>('Department', Schema)

export const DepartmentChange = appInstance.dbs.mongo.change(Department, DepartmentDbChangeCallbacks, new DepartmentMapper().mapFrom)