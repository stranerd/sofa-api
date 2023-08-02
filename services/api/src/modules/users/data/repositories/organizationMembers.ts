import { appInstance } from '@utils/types'
import { ClientSession } from 'mongodb'
import { IOrganizationMemberRepository } from '../../domain/irepositories/organizationMembers'
import { OrganizationMemberMapper } from '../mappers/organizationMembers'
import { OrganizationMemberFromModel, OrganizationMemberToModel } from '../models/organizationMembers'
import { OrganizationMember } from '../mongooseModels/organizationMembers'

export class OrganizationMemberRepository implements IOrganizationMemberRepository {
	private static instance: OrganizationMemberRepository
	private mapper = new OrganizationMemberMapper()

	static getInstance (): OrganizationMemberRepository {
		if (!OrganizationMemberRepository.instance) OrganizationMemberRepository.instance = new OrganizationMemberRepository()
		return OrganizationMemberRepository.instance
	}

	async find (id: string) {
		const organizationMember = await OrganizationMember.findById(id)
		return this.mapper.mapFrom(organizationMember)
	}

	async get (query) {
		const data = await appInstance.dbs.mongo.query(OrganizationMember, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!)
		}
	}

	async add (data: { userId: string, organizationId: string, emails: string[] }) {
		const members: OrganizationMemberFromModel[] = []
		await OrganizationMember.collection.conn.transaction(async (session) => {
			const hasAccess = await this.#userIdHasAccessToOrg(data.userId, data.organizationId, session)
			if (!hasAccess) return false
			await Promise.all(data.emails.map(async (email) => {
				const member = await OrganizationMember.findOneAndUpdate(
					{ email, organizationId: data.organizationId },
					{
						$setOnInsert: { email, organizationId: data.organizationId },
						$set: { accepted: { is: true, at: Date.now() }, pending: false }
					},
					{ upsert: true, new: true, session })
				members.push(member)
			}))

			return members
		})
		return members.map((member) => this.mapper.mapFrom(member)!)
	}

	async request (data: { email: string, organizationId: string, withCode: boolean }) {
		const updateData: OrganizationMemberToModel = { ...data, pending: true, accepted: null }
		const organizationMember = await OrganizationMember.findOneAndUpdate(
			{ email: data.email, organizationId: data.organizationId },
			{ $setOnInsert: updateData },
			{ upsert: true, new: true })
		return this.mapper.mapFrom(organizationMember)!
	}

	async accept (data: { email: string, userId: string, organizationId: string, accept: boolean }) {
		let res = false
		await OrganizationMember.collection.conn.transaction(async (session) => {
			const hasAccess = await this.#userIdHasAccessToOrg(data.userId, data.organizationId, session)
			if (!hasAccess) return false
			const organizationMember = await OrganizationMember.findOneAndUpdate(
				{ email: data.email, organizationId: data.organizationId, pending: true },
				{ $set: { accepted: { is: data.accept, at: Date.now() }, pending: data.accept } },
				{ session, new: true }
			)
			res = !!organizationMember
			return res
		})
		return res
	}

	async remove (data: { userId: string | null, organizationId: string, email: string }) {
		let res = false
		await OrganizationMember.collection.conn.transaction(async (session) => {
			const byAdmin = !!data.userId
			if (byAdmin) {
				const hasAccess = await this.#userIdHasAccessToOrg(data.userId!, data.organizationId, session)
				if (!hasAccess) return false
			}
			const organizationMember = await OrganizationMember.findOneAndDelete(
				{ email: data.email, organizationId: data.organizationId },
				{ session }
			)
			res = !!organizationMember
			return res
		})
		return res
	}

	async aggregateOrgMembersDays () {
		const data: { _id: string, total: number }[] = await OrganizationMember.aggregate([
			{ $match: { 'accepted.is': true } },
			{ $group: { _id: '$organizationId', total: { $count: {} } } }
		])
		return data.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.total }), {} as Record<string, number>)
	}

	async #userIdHasAccessToOrg (userId: string, organizationId: string, _: ClientSession) {
		return userId === organizationId
	}
}