import { UserAccount, UserBio, UserDates, UserRoles, UserSchoolData, UserStatus } from '../../domain/types'

export interface UserFromModel extends UserToModel {
	_id: string;
}

export interface UserToModel {
	bio: UserBio
	roles: UserRoles
	dates: UserDates
	status: UserStatus
	account: UserAccount
	school: UserSchoolData | null
}
