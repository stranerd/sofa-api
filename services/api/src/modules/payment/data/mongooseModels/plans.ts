import { appInstance } from '@utils/types'
import { PlanDataType } from '../../domain/types'
import { PlanDbChangeCallbacks } from '../../utils/changes/plans'
import { PlanMapper } from '../mappers/plans'
import { PlanFromModel } from '../models/plans'

const PlanSchema = new appInstance.dbs.mongo.Schema<PlanFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	title: {
		type: String,
		required: true
	},
	active: {
		type: Boolean,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	currency: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	data: Object.fromEntries(
		Object.values(PlanDataType).map((key) => [key, {
			type: Number,
			required: false,
			default: 0
		}])
	),
	usersFor: {
		type: [String],
		required: false,
		default: []
	},
	interval: {
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

export const Plan = appInstance.dbs.mongo.use('payment').model<PlanFromModel>('Plan', PlanSchema)

export const PlanChange = appInstance.dbs.mongo.change(Plan, PlanDbChangeCallbacks, new PlanMapper().mapFrom)