import { appInstance } from '@utils/types'
import { OrganizationMemberDbChangeCallbacks } from '../../utils/changes/organizationMembers'
import { OrganizationMemberMapper } from '../mappers/organizationMembers'
import { OrganizationMemberFromModel } from '../models/organizationMembers'

const OrganizationMemberSchema = new appInstance.dbs.mongo.Schema<OrganizationMemberFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	email: {
		type: String,
		required: true
	},
	organizationId: {
		type: String,
		required: true
	},
	pending: {
		type: Boolean,
		required: false,
		default: true
	},
	withPassword: {
		type: Boolean,
		required: false,
		default: false
	},
	accepted: {
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

export const OrganizationMember = appInstance.dbs.mongo.use('users').model<OrganizationMemberFromModel>('OrganizationMember', OrganizationMemberSchema)

export const OrganizationMemberChange = appInstance.dbs.mongo.change(OrganizationMember, OrganizationMemberDbChangeCallbacks, new OrganizationMemberMapper().mapFrom)