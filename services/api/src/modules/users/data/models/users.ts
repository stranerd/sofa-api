import {
	UserAccount,
	UserAi,
	UserBio,
	UserDates,
	UserLocation,
	UserRoles,
	UserSocialsType,
	UserStatus,
	UserTutor,
	UserTypeData,
} from '../../domain/types'

export interface UserFromModel extends UserToModel {
	_id: string
}

export interface UserToModel {
	bio: UserBio
	roles: UserRoles
	dates: UserDates
	status: UserStatus
	account: UserAccount
	type: UserTypeData | null
	tutor: UserTutor
	ai: UserAi
	socials: UserSocialsType
	location: UserLocation | null
}
