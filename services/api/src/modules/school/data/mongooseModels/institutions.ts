import { InstitutionDbChangeCallbacks } from '../../utils/changes/institutions'
import { appInstance } from '@utils/types'
import { InstitutionMapper } from '../mappers/institutions'
import { InstitutionFromModel } from '../models/institutions'

const Schema = new appInstance.dbs.mongo.Schema<InstitutionFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	name: {
		type: String,
		required: true
	},
	isGateway: {
		type: Boolean,
		required: false,
		default: false
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

export const Institution = appInstance.dbs.mongo.use('school').model<InstitutionFromModel>('Institution', Schema)

export const InstitutionChange = appInstance.dbs.mongo.change(Institution, InstitutionDbChangeCallbacks, new InstitutionMapper().mapFrom)