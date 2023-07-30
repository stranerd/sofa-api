import { appInstance } from '@utils/types'
import { IOrganizationMemberRepository } from '../../domain/irepositories/organizationMembers'
import { OrganizationMemberMapper } from '../mappers/organizationMembers'
import { OrganizationMemberFromModel, OrganizationMemberToModel } from '../models/organizationMembers'
import { OrganizationMember } from '../mongooseModels/organizationMembers'
import { ClientSession } from 'mongodb'

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
			if (!this.#userIdHasAccessToOrg(data.userId, data.organizationId, session)) return false
			await Promise.all(data.emails.map(async (email) => {
				const member = await OrganizationMember.findOneAndUpdate(
					{ email, organizationId: data.organizationId },
					{
						$setOnInsert: { email, organizationId: data.organizationId },
						$set: { accepted: Date.now(), pending: false }
					},
					{ upsert: true, new: true, session })
				members.push(member)
			}))

			return members
		})
		return members.map((member) => this.mapper.mapFrom(member)!)
	}

	async request (data: { email: string, organizationId: string, withPassword: boolean }) {
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
			if (!this.#userIdHasAccessToOrg(data.userId, data.organizationId, session)) return false
			const organizationMember = await OrganizationMember.findOneAndUpdate(
				{ email: data.email, organizationId: data.organizationId, pending: true },
				{ $set: { accepted: Date.now(), pending: data.accept } },
				{ session, new: true }
			)
			res = !!organizationMember
			return res
		})
		return res
	}

	async #userIdHasAccessToOrg (userId: string, organizationId: string, _: ClientSession) {
		return userId === organizationId
	}
}