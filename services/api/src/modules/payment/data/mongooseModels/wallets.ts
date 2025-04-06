import { appInstance } from '@utils/types'

import { Currencies, PlanDataType } from '../../domain/types'
import { WalletDbChangeCallbacks } from '../../utils/changes/wallets'
import { WalletMapper } from '../mappers/wallets'
import type { WalletFromModel } from '../models/wallets'

const WalletSchema = new appInstance.dbs.mongo.Schema<WalletFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		userId: {
			type: String,
			required: true,
		},
		balance: {
			amount: {
				type: Number,
				required: false,
				default: 0,
			},
			currency: {
				type: String,
				required: false,
				default: Currencies.NGN,
			},
		},
		accounts: {
			type: [appInstance.dbs.mongo.Schema.Types.Mixed as any],
			required: false,
			default: [],
		},
		subscription: {
			active: {
				type: Boolean,
				required: false,
				default: false,
			},
			methodId: {
				type: appInstance.dbs.mongo.Schema.Types.Mixed,
				required: false,
				default: null,
			},
			current: {
				type: appInstance.dbs.mongo.Schema.Types.Mixed,
				required: false,
				default: null,
			},
			next: {
				type: appInstance.dbs.mongo.Schema.Types.Mixed,
				required: false,
				default: null,
			},
			data: Object.fromEntries(
				Object.values(PlanDataType).map((key) => [
					key,
					{
						type: Number,
						required: false,
						default: 0,
					},
				]),
			),
			membersDays: {
				type: Number,
				required: false,
				default: 0,
			},
		},
		subscriptions: {
			type: [appInstance.dbs.mongo.Schema.Types.Mixed] as unknown as WalletFromModel['subscriptions'],
			required: false,
			default: () => [],
		},
		createdAt: {
			type: Number,
			required: false,
			default: Date.now,
		},
		updatedAt: {
			type: Number,
			required: false,
			default: Date.now,
		},
	},
	{ timestamps: { currentTime: Date.now }, minimize: false },
)

export const Wallet = appInstance.dbs.mongo.use('payment').model<WalletFromModel>('Wallet', WalletSchema)

export const WalletChange = appInstance.dbs.mongo.change(Wallet, WalletDbChangeCallbacks, new WalletMapper().mapFrom)
