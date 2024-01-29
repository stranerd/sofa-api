import { BaseEntity } from 'equipped'

export class DepartmentEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string
	public readonly institutionId: string
	public readonly facultyId: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, title, institutionId, facultyId, createdAt, updatedAt }: DepartmentConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.institutionId = institutionId
		this.facultyId = facultyId
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type DepartmentConstructorArgs = {
	id: string
	title: string
	institutionId: string
	facultyId: string
	createdAt: number
	updatedAt: number
}
