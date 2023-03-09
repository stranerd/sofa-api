import { BaseEntity } from 'equipped'
import { TagTypes } from '../types'

export class TagEntity extends BaseEntity {
	public readonly id: string
	public readonly type: TagTypes
	public readonly title: string
	public readonly parent: string | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		id, type, title, parent, createdAt, updatedAt
	}: TagConstructorArgs) {
		super()
		this.id = id
		this.type = type
		this.title = title
		this.parent = parent
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type TagConstructorArgs = {
	id: string
	type: TagTypes
	title: string
	parent: string | null
	createdAt: number
	updatedAt: number
}