import { BaseEntity } from 'equipped'

export class FacultyEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string
	public readonly institutionId: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, title, institutionId, createdAt, updatedAt }: FacultyConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.institutionId = institutionId
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type FacultyConstructorArgs = { id: string; title: string; institutionId: string; createdAt: number; updatedAt: number }
