import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, FolderSaved } from '../types'

export class FolderEntity extends BaseEntity<FolderConstructorArgs> {
	constructor(data: FolderConstructorArgs) {
		data.user = generateDefaultUser(data.user)
		super(data)
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
