import { QueryParams, QueryResults } from 'equipped'
import { UserEntity } from '../entities/users'
import { ScoreRewards, UserAccount, UserAi, UserBio, UserLocation, UserRoles, UserSocialsType, UserTypeData } from '../types'

export interface IUserRepository {
	getUsers (query: QueryParams): Promise<QueryResults<UserEntity>>

	createOrUpdateUser (userId: string, data: UserBio, timestamp: number): Promise<void>

	updateUserWithRoles (userId: string, data: UserRoles, timestamp: number): Promise<void>

	markUserAsDeleted (userId: string, timestamp: number): Promise<void>

	findUser (userId: string): Promise<UserEntity | null>

	incrementUserMetaProperty (userId: string, propertyName: keyof UserAccount['meta'], value: number): Promise<void>

	updateNerdScore (userId: string, amount: ScoreRewards): Promise<boolean>

	resetRankings (key: keyof UserAccount['rankings']): Promise<boolean>

	updateUserStatus (userId: string, socketId: string, add: boolean): Promise<boolean>

	resetAllUsersStatus (): Promise<boolean>

	updateType (userId: string, data: UserTypeData): Promise<UserEntity | null>

	updateOrgCode (userId: string, code: string): Promise<UserEntity | null>

	updateTutorConversations (userId: string, conversationId: string, add: boolean): Promise<boolean>

	updateTutorTopics (userId: string, topicId: string, add: boolean): Promise<UserEntity | null>

	updateOrganizationsIn (email: string, organizations: UserAccount['organizationsIn'], add: boolean): Promise<UserEntity | null>

	updateSocials (userId: string, socials: UserSocialsType): Promise<UserEntity | null>

	updateAi (userId: string, ai: Partial<UserAi>): Promise<UserEntity | null>

	updateRatings (userId: string, ratings: number, add: boolean): Promise<boolean>

	updateLocation (userId: string, location: UserLocation): Promise<UserEntity | null>

	updateSettings (userId: string, settings: Partial<UserAccount['settings']>): Promise<UserEntity | null>

	updateEditing (userId: string, editing: Partial<UserAccount['editing']>): Promise<UserEntity | null>
}