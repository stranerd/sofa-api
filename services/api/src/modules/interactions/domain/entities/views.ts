import { BaseEntity } from 'equipped'

import { generateDefaultUser } from '@modules/users'

import type { EmbeddedUser, InteractionEntity } from '../types'

export class ViewEntity extends BaseEntity<ViewConstructorArgs> {
	constructor(data: ViewConstructorArgs) {
		data.user = generateDefaultUser(data.user)
		super(data)
	}
}

type ViewConstructorArgs = {
	id: string
	entity: InteractionEntity
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}
