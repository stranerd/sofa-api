import { appInstance } from '@utils/types'
import { UserDbChangeCallbacks } from '../../utils/changes/users'
import { UserMapper } from '../mappers/users'
import { UserFromModel } from '../models/users'

const UserSchema = new appInstance.dbs.mongo.Schema<UserFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: false,
		default: ''
	},
	firstName: {
		type: String,
		trim: true,
		required: false,
		default: ''
	},
	lastName: {
		type: String,
		trim: true,
		required: false,
		default: ''
	},
	description: {
		type: String,
		trim: true,
		required: false,
		default: ''
	},
	photo: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: null
	},
	phone: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: false,
		default: null
	},
	isVerified: {
		type: Boolean,
		required: false,
		default: false
	},
	authTypes: {
		type: [String],
		set: (types: string[]) => Array.from(new Set(types)),
		required: false,
		default: []
	},
	roles: {
		type: Object as unknown as UserFromModel['roles'],
		required: false,
		default: {} as unknown as UserFromModel['roles']
	},
	lastSignedInAt: {
		type: Number,
		required: false,
		default: Date.now
	},
	signedUpAt: {
		type: Number,
		required: false,
		default: Date.now
	}
})

export const User = appInstance.dbs.mongo.use('auth').model<UserFromModel>('User', UserSchema)

export const UserChange = appInstance.dbs.mongo.change(User, UserDbChangeCallbacks, new UserMapper().mapFrom)

export default User