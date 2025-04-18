import { BaseEntity } from 'equipped'

import { generateDefaultUser } from '@modules/users'

import type { EmbeddedUser, InteractionEntity } from '../types'

export class ReviewEntity extends BaseEntity<ReviewConstructorArgs> {
	constructor(data: ReviewConstructorArgs) {
		data.user = generateDefaultUser(data.user)
		super(data)
	}
}

type ReviewConstructorArgs = {
	id: string
	entity: InteractionEntity
	user: EmbeddedUser
	rating: number
	message: string
	createdAt: number
	updatedAt: number
}
