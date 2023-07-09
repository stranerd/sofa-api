import { appInstance } from '@utils/types'
import { PurchaseDbChangeCallbacks } from '../../utils/changes/purchases'
import { PurchaseMapper } from '../mappers/purchases'
import { PurchaseFromModel } from '../models/purchases'

const PurchaseSchema = new appInstance.dbs.mongo.Schema<PurchaseFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	price: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	data: {
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

export const Purchase = appInstance.dbs.mongo.use('payment').model<PurchaseFromModel>('Purchase', PurchaseSchema)

export const PurchaseChange = appInstance.dbs.mongo.change(Purchase, PurchaseDbChangeCallbacks, new PurchaseMapper().mapFrom)