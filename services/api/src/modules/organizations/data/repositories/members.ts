import { appInstance } from '@utils/types'
import { ClientSession } from 'mongodb'
import { UserMapper } from '../../../users/data/mappers/users'
import { User } from '../../../users/data/mongooseModels/users'
import { IMemberRepository } from '../../domain/irepositories/members'
import { MemberTypes } from '../../domain/types'
import { MemberMapper } from '../mappers/members'
import { MemberFromModel, MemberToModel } from '../models/members'
import { Member } from '../mongooseModels/members'

export class MemberRepository implements IMemberRepository {
	private static instance: MemberRepository
	private mapper = new MemberMapper()
	private userMapper = new UserMapper()

	static getInstance (): MemberRepository {
		if (!MemberRepository.instance) MemberRepository.instance = new MemberRepository()
		return MemberRepository.instance
	}

	async find (id: string) {
		const organizationMember = await Member.findById(id)
		return this.mapper.mapFrom(organizationMember)
	}

	async get (query) {
		const data = await appInstance.dbs.mongo.query(Member, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!)
		}
	}

	async add (data: { userId: string, organizationId: string, members: { email: string, userId: string | null, type: MemberTypes }[] }) {
		const members: MemberFromModel[] = []
		await Member.collection.conn.transaction(async (session) => {
			const hasAccess = await this.#userIdHasAccessToOrg(data.userId, data.organizationId, session)
			if (!hasAccess) return false
			await Promise.all(data.members.map(async ({ email, userId, type}) => {
				const member = await Member.findOneAndUpdate(
					{ email, type, organizationId: data.organizationId },
					{
						$setOnInsert: { email, type, userId, organizationId: data.organizationId },
						$set: { accepted: { is: true, at: Date.now() }, pending: false }
					},
					{ upsert: true, new: true, session })
				members.push(member)
			}))

			return members
		})
		return members.map((member) => this.mapper.mapFrom(member)!)
	}

	async request (data: { email: string, userId: string | null, type: MemberTypes, organizationId: string, withCode: boolean }) {
		const updateData: MemberToModel = { ...data, pending: true, accepted: null }
		const organizationMember = await Member.findOneAndUpdate(
			{ email: data.email, organizationId: data.organizationId },
			{ $setOnInsert: updateData },
			{ upsert: true, new: true })
		return this.mapper.mapFrom(organizationMember)!
	}

	async accept (data: { email: string, type: MemberTypes, userId: string, organizationId: string, accept: boolean }) {
		let res = false
		await Member.collection.conn.transaction(async (session) => {
			const hasAccess = await this.#userIdHasAccessToOrg(data.userId, data.organizationId, session)
			if (!hasAccess) return false
			const organizationMember = await Member.findOneAndUpdate(
				{ email: data.email, type: data.type, organizationId: data.organizationId, pending: true },
				{ $set: { accepted: { is: data.accept, at: Date.now() }, pending: data.accept } },
				{ session, new: true }
			)
			res = !!organizationMember
			return res
		})
		return res
	}

	async remove (data: { userId: string | null, organizationId: string, email: string, type: MemberTypes }) {
		let res = false
		await Member.collection.conn.transaction(async (session) => {
			const byAdmin = !!data.userId
			if (byAdmin) {
				const hasAccess = await this.#userIdHasAccessToOrg(data.userId!, data.organizationId, session)
				if (!hasAccess) return false
			}
			const organizationMember = await Member.findOneAndDelete(
				{ email: data.email, type: data.type, organizationId: data.organizationId },
				{ session }
			)
			res = !!organizationMember
			return res
		})
		return res
	}

	async aggregateMembersDays () {
		const data: { _id: string, total: number }[] = await Member.aggregate([
			{ $match: { 'accepted.is': true } },
			{ $group: { _id: '$organizationId', total: { $count: {} } } }
		])
		return data.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.total }), {} as Record<string, number>)
	}

	async deleteByEmail (email: string) {
		const res = await Member.deleteMany({ email })
		return res.acknowledged
	}

	async #userIdHasAccessToOrg (userId: string, organizationId: string, session: ClientSession) {
		if (userId !== organizationId) return false
		const user = this.userMapper.mapFrom(await User.findById(organizationId, {}, { session }))
		if (!user || user.isDeleted() || !user.isOrg()) return false
		return true
	}
}