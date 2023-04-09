import { BaseEntity } from 'equipped'
import { TagMetaType, TagTypes } from '../types'

export class TagEntity extends BaseEntity {
	public readonly id: string
	public readonly type: TagTypes
	public readonly title: string
	public readonly parent: string | null
	public readonly meta: TagMetaType
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		id, type, title, parent, meta, createdAt, updatedAt
	}: TagConstructorArgs) {
		super()
		this.id = id
		this.type = type
		this.title = title
		this.parent = parent
		this.meta = meta
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	isTopic () {
		return this.type === TagTypes.topics
	}
}

type TagConstructorArgs = {
	id: string
	type: TagTypes
	title: string
	parent: string | null
	meta: TagMetaType
	createdAt: number
	updatedAt: number
}