import { BaseEntity, Validation } from 'equipped'
import { getNextRank, getRank } from '../../utils/ranks'
import {
	EmbeddedUser,
	UserAccount,
	UserAi,
	UserBio,
	UserDates,
	UserLocation,
	UserRoles,
	UserSocialsType,
	UserStatus,
	UserTutor,
	UserType,
	UserTypeData,
} from '../types'

export class UserEntity extends BaseEntity {
	public readonly id: string
	public readonly bio: UserBio
	public readonly roles: UserRoles
	public readonly dates: UserDates
	public readonly status: UserStatus
	public readonly account: UserAccount
	public readonly type: UserTypeData | null
	public readonly tutor: UserTutor
	public readonly ai: UserAi
	public readonly socials: UserSocialsType
	public readonly location: UserLocation | null
	ignoreInJSON = ['type.code', 'bio.email', 'bio.phone']

	constructor({ id, bio, roles, dates, status, account, type, tutor, ai, socials, location }: UserConstructorArgs) {
		super()
		this.id = id
		this.bio = generateDefaultBio(bio ?? {})
		this.roles = generateDefaultRoles(roles ?? {})
		this.dates = dates
		this.status = status
		this.account = account
		this.type = type
		this.tutor = tutor
		this.ai = ai
		this.socials = socials
		this.location = location
	}

	get rank() {
		return getRank(this.account.rankings.overall.value ?? 0)
	}

	get nextRank() {
		return getNextRank(this.rank.id)
	}

	isBioComplete() {
		return this.bio.photo && this.bio.description
	}

	isDeleted() {
		return this.dates.deletedAt !== null
	}

	isTeacher() {
		return this.type?.type === UserType.teacher
	}

	isOrg() {
		return this.type?.type === UserType.organization
	}

	getOrgCode() {
		if (this.type?.type !== UserType.organization) return null
		return this.type.code
	}

	getEmbedded(): EmbeddedUser {
		const publicName = this.type?.type === UserType.organization ? this.type.name : this.bio.name.full
		return {
			id: this.id,
			bio: { name: this.bio.name, photo: this.bio.photo, publicName },
			roles: this.roles,
			type: this.type,
		}
	}

	canJoinConversations() {
		return this.isTeacher() && this.tutor.conversations.length < 5
	}
}

type UserConstructorArgs = {
	id: string
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

const generateDefaultBio = (bio: Partial<UserBio>): UserBio => {
	const first = Validation.capitalize(bio?.name?.first ?? 'Anon')
	const last = Validation.capitalize(bio?.name?.last ?? 'Ymous')
	const full = Validation.capitalize(bio?.name?.full ?? first + ' ' + last)
	const email = bio?.email ?? 'anon@ymous.com'
	const description = bio?.description ?? ''
	const photo = bio?.photo ?? null
	const phone = bio?.phone ?? null
	return { name: { first, last, full }, email, description, photo, phone }
}

const generateDefaultRoles = (roles: Partial<UserRoles>): UserRoles => roles ?? {}

export const generateDefaultUser = (user: Partial<EmbeddedUser>): EmbeddedUser => {
	const id = user?.id ?? ''
	const bio = generateDefaultBio(user?.bio ?? {})
	const roles = generateDefaultRoles(user?.roles ?? {})
	const type = user?.type ?? null
	// @ts-ignore
	if (type && type.type === UserType.organization) delete type.code
	const publicName = type?.type === UserType.organization ? type.name : bio.name.full
	return {
		id,
		bio: { name: bio.name, photo: bio.photo, publicName },
		roles,
		type,
	}
}
