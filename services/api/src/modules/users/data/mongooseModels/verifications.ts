import { appInstance } from '@utils/types'
import { VerificationDbChangeCallbacks } from '../../utils/changes/verifications'
import { VerificationMapper } from '../mappers/verifications'
import { VerificationFromModel } from '../models/verifications'

const VerificationSchema = new appInstance.dbs.mongo.Schema<VerificationFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		userId: {
			type: String,
			required: true,
		},
		content: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: true,
		},
		pending: {
			type: Boolean,
			required: false,
			default: true,
		},
		accepted: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: false,
			default: null,
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

export const Verification = appInstance.dbs.mongo.use('users').model<VerificationFromModel>('Verification', VerificationSchema)

export const VerificationChange = appInstance.dbs.mongo.change(
	Verification,
	VerificationDbChangeCallbacks,
	new VerificationMapper().mapFrom,
)
