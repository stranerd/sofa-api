import { BaseEntity } from 'equipped'
import { EmbeddedUser } from '../types'
import { generateDefaultUser } from './users'

export class ConnectEntity extends BaseEntity<ConnectConstructorArgs> {
	constructor(data: ConnectConstructorArgs) {
		data.from = generateDefaultUser(data.from)
		data.to = generateDefaultUser(data.to)
		super(data)
	}
}

type ConnectConstructorArgs = {
	id: string
	from: EmbeddedUser
	to: EmbeddedUser
	pending: boolean
	accepted: boolean
	createdAt: number
	updatedAt: number
}
