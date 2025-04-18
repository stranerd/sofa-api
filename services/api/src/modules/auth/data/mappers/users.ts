import { BaseMapper } from 'equipped'

import { AuthUserEntity } from '../../domain/entities/users'
import type { UserFromModel, UserToModel } from '../models/users'

export class UserMapper extends BaseMapper<UserFromModel, UserToModel, AuthUserEntity> {
	mapFrom(param: UserFromModel | null) {
		return !param
			? null
			: new AuthUserEntity({
					id: param._id.toString(),
					email: param.email,
					password: param.password,
					roles: param.roles,
					name: param.name,
					description: param.description,
					photo: param.photo,
					phone: param.phone,
					isEmailVerified: param.isEmailVerified,
					authTypes: param.authTypes,
					lastSignedInAt: param.lastSignedInAt,
					signedUpAt: param.signedUpAt,
				})
	}

	mapTo(param: AuthUserEntity) {
		return {
			email: param.email,
			password: param.password,
			roles: param.roles,
			name: param.name,
			description: param.description,
			photo: param.photo,
			phone: param.phone,
			isEmailVerified: param.isEmailVerified,
			authTypes: param.authTypes,
			lastSignedInAt: param.lastSignedInAt,
			signedUpAt: param.signedUpAt,
		}
	}
}
