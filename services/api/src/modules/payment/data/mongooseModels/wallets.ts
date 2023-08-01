import { appInstance } from '@utils/types'
import { Currencies, PlanDataType } from '../../domain/types'
import { WalletDbChangeCallbacks } from '../../utils/changes/wallets'
import { WalletMapper } from '../mappers/wallets'
import { WalletFromModel } from '../models/wallets'

const WalletSchema = new appInstance.dbs.mongo.Schema<WalletFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	userId: {
		type: String,
		required: true
	},
	balance: {
		amount: {
			type: Number,
			required: false,
			default: 0
		},
		currency: {
			type: String,
			required: false,
			default: Currencies.NGN
		}
	},
	account: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: null
	},
	subscription: {
		active: {
			type: Boolean,
			required: false,
			default: false
		},
		current: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: false,
			default: null
		},
		next: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: false,
			default: null
		},
		data: Object.fromEntries(
			Object.values(PlanDataType).map((key) => [key, {
				type: Number,
				required: false,
				default: 0
			}])
		),
		studentsDays: {
			type: Number,
			required: false,
			default: 0
		}
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

export const Wallet = appInstance.dbs.mongo.use('payment').model<WalletFromModel>('Wallet', WalletSchema)

export const WalletChange = appInstance.dbs.mongo.change(Wallet, WalletDbChangeCallbacks, new WalletMapper().mapFrom)