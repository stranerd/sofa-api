import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, FolderSaved } from '../types'

export class FolderEntity extends BaseEntity {
	public readonly id: string
	public readonly name: string
	public readonly saved: Record<FolderSaved, string[]>
	public readonly user: EmbeddedUser
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, name, saved, user, createdAt, updatedAt }: FolderConstructorArgs) {
		super()
		this.id = id
		this.name = name
		this.saved = saved
		this.user = generateDefaultUser(user)
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type FolderConstructorArgs = {
	id: string
	name: string
	saved: Record<FolderSaved, string[]>
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}