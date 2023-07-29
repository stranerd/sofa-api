import { appInstance } from '@utils/types'
import { WithdrawalDbChangeCallbacks } from '../../utils/changes/withdrawals'
import { WithdrawalMapper } from '../mappers/withdrawals'
import { WithdrawalFromModel } from '../models/withdrawals'

const WithdrawalSchema = new appInstance.dbs.mongo.Schema<WithdrawalFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	userId: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	currency: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	account: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	externalId: {
		type: Number,
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

export const Withdrawal = appInstance.dbs.mongo.use('payment').model<WithdrawalFromModel>('Withdrawal', WithdrawalSchema)

export const WithdrawalChange = appInstance.dbs.mongo.change(Withdrawal, WithdrawalDbChangeCallbacks, new WithdrawalMapper().mapFrom)