import { UserAccount, UserBio, UserDates, UserRoles, UserStatus, UserTutor, UserTypeData } from '../../domain/types'

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
}
