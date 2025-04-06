import { appInstance } from '@utils/types'

import { MemberTypes } from '../../domain/types'
import { MemberDbChangeCallbacks } from '../../utils/changes/members'
import { MemberMapper } from '../mappers/members'
import type { MemberFromModel } from '../models/members'

const MemberSchema = new appInstance.dbs.mongo.Schema<MemberFromModel>(
	{
		_id: {
			type: String,
			default: () => appInstance.dbs.mongo.Id.toString(),
		},
		email: {
			type: String,
			required: true,
		},
		user: {
			type: appInstance.dbs.mongo.Schema.Types.Mixed,
			required: false,
			default: null,
		},
		type: {
			type: String,
			required: true,
			default: MemberTypes.student,
		},
		organizationId: {
			type: String,
			required: true,
		},
		pending: {
			type: Boolean,
			required: false,
			default: true,
		},
		withCode: {
			type: Boolean,
			required: false,
			default: false,
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

export const Member = appInstance.dbs.mongo.use('organizations').model<MemberFromModel>('Member', MemberSchema)

export const MemberChange = appInstance.dbs.mongo.change(Member, MemberDbChangeCallbacks, new MemberMapper().mapFrom)
