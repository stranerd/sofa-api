import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, FolderSaved } from '../types'

export class FolderEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string
	public readonly saved: Record<FolderSaved, string[]>
	public readonly user: EmbeddedUser
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, title, saved, user, createdAt, updatedAt }: FolderConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.saved = saved
		this.user = generateDefaultUser(user)
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type FolderConstructorArgs = {
	id: string
	title: string
	saved: Record<FolderSaved, string[]>
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}
