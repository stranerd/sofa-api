import { appInstance } from '@utils/types'
import { IUserRepository } from '../../domain/irepositories/users'
import { UserAccount, UserBio, UserRankings, UserRoles, UserSchoolData } from '../../domain/types'
import { getDateDifference } from '../../utils/dates'
import { UserMapper } from '../mappers/users'
import { User } from '../mongooseModels/users'

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
			Object.keys(UserRankings).map((key) => [`account.rankings.${key}.value`, amount])
		)
		const lastUpdatedAt = Object.fromEntries(
			Object.keys(UserRankings).map((key) => [`account.rankings.${key}.lastUpdatedAt`, amount])
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
				[`account.meta.${propertyName}`]: value
			}
		})
	}

	private async updateUserStreak (userId: string) {
		const res = { skip: false, increase: false, reset: false, streak: 0 }
		await User.collection.conn.transaction(async (session) => {
			const userModel = await User.findById(userId, null, { session })
			const user = this.mapper.mapFrom(userModel)
			const { lastEvaluatedAt = 0, count = 0, longestStreak = 0 } = user?.account?.streak ?? {}
			const { isLessThan, isNextDay } = getDateDifference(new Date(lastEvaluatedAt), new Date())

			res.skip = isLessThan
			res.increase = !isLessThan && isNextDay
			res.reset = !isLessThan && !isNextDay
			res.streak = !isLessThan && isNextDay ? count + 1 : 1

			const updateData = {
				'account.streak.lastEvaluatedAt': Date.now(),
				'account.streak.count': res.increase ? count + 1 : 1
			}
			if (res.increase && count + 1 > longestStreak) updateData['account.streak.longestStreak'] = count + 1
			if (!res.skip) await User.findByIdAndUpdate(userId, { $set: updateData }, { session })
		})
		return res
	}

	async updateUserStatus (userId: string, socketId: string, add: boolean) {
		const user = await User.findByIdAndUpdate(userId, {
			$set: { 'status.lastUpdatedAt': Date.now() },
			[add ? '$addToSet' : '$pull']: { 'status.connections': socketId }
		})
		if (add) await this.updateUserStreak(userId)
		return !!user
	}

	async resetAllUsersStatus () {
		const res = await User.updateMany({}, {
			$set: { 'status.connections': [] }
		})
		return !!res.acknowledged
	}

	async updateUserSchoolData (userId: string, data: UserSchoolData) {
		const user = await User.findByIdAndUpdate(userId, { $set: { school: data } })
		return !!user
	}
}