import { BaseEntity } from 'equipped'

import { generateDefaultUser } from '@modules/users'

import type { CommentMetaType, EmbeddedUser, InteractionEntity } from '../types'

export class CommentEntity extends BaseEntity<CommentConstructorArgs> {
	constructor(data: CommentConstructorArgs) {
		data.user = generateDefaultUser(data.user)
		super(data)
	}
}

type CommentConstructorArgs = {
	id: string
	body: string
	entity: InteractionEntity
	user: EmbeddedUser
	meta: CommentMetaType
	createdAt: number
	updatedAt: number
}
