import { EmbeddedUser } from '../../domain/types'

export interface ConnectFromModel extends ConnectToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface ConnectToModel {
	from: EmbeddedUser
	to: EmbeddedUser
	pending: boolean
	accepted: boolean
}
