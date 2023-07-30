import { appInstance } from '@utils/types'
import { IUserRepository } from '../../domain/irepositories/users'
import { UserAccount, UserAi, UserBio, UserLocation, UserMeta, UserRankings, UserRoles, UserSocialsType, UserTypeData } from '../../domain/types'
import { getDateDifference } from '../../utils/dates'
import { UserMapper } from '../mappers/users'
import { UserFromModel } from '../models/users'
import { User } from '../mongooseModels/users'
import { AuthRole } from 'equipped'

export class UserRepository implements IUserRepository {
	private static instance: UserRepository
	private mapper = new UserMapper()

	static getInstance (): UserRepository {
		if (!UserRepository.instance) UserRepository.instance = new UserRepository()
		return UserRepository.instance
	}

	async getUsers (query) {
		const data = await appInstance.dbs.mongo.query(User, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!)
		}
	}

	async createOrUpdateUser (userId: string, data: UserBio, timestamp: number) {
		await User.findByIdAndUpdate(userId, {
			$set: { bio: data },
			$setOnInsert: { _id: userId, dates: { createdAt: timestamp, deletedAt: null } }
		}, { upsert: true })
	}

	async findUser (userId: string) {
		const user = await User.findById(userId)
		return this.mapper.mapFrom(user)
	}

	async markUserAsDeleted (userId: string, timestamp: number) {
		await User.findByIdAndUpdate(userId, {
			$set: { 'dates.deletedAt': timestamp }
		}, { upsert: true })
	}

	async updateNerdScore (userId: string, amount: number) {
		const rankings = Object.fromEntries(
			Object.values(UserRankings).map((key) => [`account.rankings.${key}.value`, amount])
		)
		const now = Date.now()
		const lastUpdatedAt = Object.fromEntries(
			Object.values(UserRankings).map((key) => [`account.rankings.${key}.lastUpdatedAt`, now])
		)
		const user = await User.findByIdAndUpdate(userId, {
			$set: lastUpdatedAt, $inc: rankings
		})
		return !!user
	}

	async resetRankings (key: keyof UserAccount['rankings']) {
		const res = await User.updateMany({}, {
			$set: { [`account.rankings.${key}`]: { value: 0, lastUpdatedAt: Date.now() } }
		})
		return !!res.acknowledged
	}

	async updateUserWithRoles (userId: string, data: UserRoles) {
		await User.findByIdAndUpdate(userId, {
			$set: { roles: data }
		}, { upsert: true })
	}

	async incrementUserMetaProperty (userId: string, propertyName: keyof UserAccount['meta'], value: 1 | -1) {
		await User.findByIdAndUpdate(userId, {
			$inc: {
				[`account.meta.${propertyName}`]: value,
				[`account.meta.${UserMeta.total}`]: value
			}
		})
	}

	private async updateUserStreak (user: UserFromModel, session: any) {
		const { lastEvaluatedAt = 0, count = 0, longestStreak = 0 } = user?.account?.streak ?? {}
		const { isLessThan, isNextDay } = getDateDifference(new Date(lastEvaluatedAt), new Date())

		const res = {
			skip: isLessThan, increase: !isLessThan && isNextDay, reset: !isLessThan && !isNextDay,
			streak: !isLessThan && isNextDay ? count + 1 : 1
		}
		const updateData = {
			'account.streak.lastEvaluatedAt': Date.now(),
			'account.streak.count': res.increase ? count + 1 : 1
		}
		if (res.increase && count + 1 > longestStreak) updateData['account.streak.longestStreak'] = count + 1
		if (!res.skip) await User.findByIdAndUpdate(user._id, { $set: updateData }, { session })
		return res
	}

	async updateUserStatus (userId: string, socketId: string, add: boolean) {
		let res = false
		await User.collection.conn.transaction(async (session) => {
			const user = await User.findByIdAndUpdate(userId, {
				$set: { 'status.lastUpdatedAt': Date.now() },
				[add ? '$addToSet' : '$pull']: { 'status.connections': socketId }
			}, { session, new: true })
			if (!user) return false
			if (add) await this.updateUserStreak(user, session)
			res = !!user
			return res
		})
		return res
	}

	async resetAllUsersStatus () {
		const res = await User.updateMany({}, {
			$set: { 'status.connections': [] }
		})
		return !!res.acknowledged
	}

	async updateUserType (userId: string, data: UserTypeData) {
		const user = await User.findOneAndUpdate(
			{ _id: userId, $or: [{ type: null }, { 'type.type': data.type }] },
			{ $set: { type: data } },
			{ new: true }
		)
		return this.mapper.mapFrom(user)
	}

	async updateTutorConversations (userId: string, conversationId: string, add: boolean) {
		const user = await User.findByIdAndUpdate(userId, {
			[add ? '$addToSet' : '$pull']: { 'tutor.conversations': conversationId }
		}, { new: true })
		return !!user
	}

	async updateTutorTopics (userId: string, topicId: string, add: boolean) {
		const user = await User.findByIdAndUpdate({
			_id: userId,
			[`roles.${AuthRole.isTutor}`]: true
		}, {
			[add ? '$addToSet' : '$pull']: { 'tutor.topics': topicId }
		}, { new: true })
		return this.mapper.mapFrom(user)
	}

	async updateAi (userId: string, ai: Partial<UserAi>) {
		ai = Object.fromEntries(
			Object.entries(ai)
				.map(([key, value]) => [`ai.${key}`, value])
		)
		const user = await User.findByIdAndUpdate(userId, { $set: ai }, { new: true })
		return this.mapper.mapFrom(user)
	}

	async updateSocials (userId: string, socials: UserSocialsType) {
		const user = await User.findByIdAndUpdate(userId, { $set: { socials } }, { new: true })
		return this.mapper.mapFrom(user)
	}

	async updateRatings (userId: string, ratings: number, add: boolean) {
		let res = false
		await User.collection.conn.transaction(async (session) => {
			const user = await User.findById(userId, {}, { session })
			if (!user) return res
			user.account.ratings.total += (add ? 1 : -1) * ratings
			user.account.ratings.count += add ? 1 : -1
			user.account.ratings.avg = Number((user.account.ratings.total / user.account.ratings.count).toFixed(2))
			res = !!(await user.save({ session }))
			return res
		})
		return res
	}

	async updateLocation(userId: string, location: UserLocation) {
		const user = await User.findByIdAndUpdate(userId, { $set: { location } }, { new: true })
		return this.mapper.mapFrom(user)
	}
}