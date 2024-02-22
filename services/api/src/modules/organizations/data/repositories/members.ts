import { appInstance } from '@utils/types'
import { IMemberRepository } from '../../domain/irepositories/members'
import { EmbeddedUser, MemberTypes } from '../../domain/types'
import { MemberMapper } from '../mappers/members'
import { MemberFromModel, MemberToModel } from '../models/members'
import { Member } from '../mongooseModels/members'

export class MemberRepository implements IMemberRepository {
	private static instance: MemberRepository
	private mapper = new MemberMapper()

	static getInstance(): MemberRepository {
		if (!MemberRepository.instance) MemberRepository.instance = new MemberRepository()
		return MemberRepository.instance
	}

	async find(id: string) {
		const organizationMember = await Member.findById(id)
		return this.mapper.mapFrom(organizationMember)
	}

	async get(query) {
		const data = await appInstance.dbs.mongo.query(Member, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!),
		}
	}

	async add(data: { organizationId: string; members: { email: string; user: EmbeddedUser | null; type: MemberTypes }[] }) {
		const members: MemberFromModel[] = []
		await Member.collection.conn.transaction(async (session) => {
			await Promise.all(
				data.members.map(async ({ email, user, type }) => {
					email = email.toLowerCase()
					const member = await Member.findOneAndUpdate(
						{ email, type, organizationId: data.organizationId },
						{
							$setOnInsert: { email, type, user, organizationId: data.organizationId },
							$set: { accepted: { is: true, at: Date.now() }, pending: false },
						},
						{ upsert: true, new: true, session },
					)
					members.push(member)
				}),
			)

			return members
		})
		return members.map((member) => this.mapper.mapFrom(member)!)
	}

	async request(data: { email: string; user: EmbeddedUser | null; type: MemberTypes; organizationId: string; withCode: boolean }) {
		data.email = data.email.toLowerCase()
		const updateData: MemberToModel = { ...data, pending: true, accepted: null }
		const organizationMember = await Member.findOneAndUpdate(
			{ email: data.email, organizationId: data.organizationId },
			{ $setOnInsert: updateData },
			{ upsert: true, new: true },
		)
		return this.mapper.mapFrom(organizationMember)!
	}

	async accept(data: { email: string; type: MemberTypes; organizationId: string; accept: boolean }) {
		const member = await Member.findOneAndUpdate(
			{ email: data.email, type: data.type, organizationId: data.organizationId, pending: true },
			{ $set: { accepted: { is: data.accept, at: Date.now() }, pending: data.accept } },
		)
		return !!member
	}

	async remove(data: { organizationId: string; email: string; type: MemberTypes }) {
		const member = await Member.findOneAndDelete({ email: data.email, type: data.type, organizationId: data.organizationId })
		return !!member
	}

	async aggregateMembersDays() {
		const data: { _id: string; total: number }[] = await Member.aggregate([
			{ $match: { 'accepted.is': true } },
			{ $group: { _id: '$organizationId', total: { $count: {} } } },
		])
		return data.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.total }), {} as Record<string, number>)
	}

	async deleteByEmail(email: string) {
		const res = await Member.deleteMany({ email })
		return res.acknowledged
	}

	async updateMemberUser(email: string, user: EmbeddedUser) {
		const members = await Member.updateMany({ email }, { $set: { user } })
		return members.acknowledged
	}

	async updateUserBio(user: EmbeddedUser) {
		const members = await Member.updateMany({ 'user.id': user.id }, { $set: { user } })
		return members.acknowledged
	}
}
