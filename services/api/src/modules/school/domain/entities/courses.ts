import { BaseEntity } from 'equipped'

export class CourseEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string
	public readonly institutionId: string
	public readonly facultyId: string | null
	public readonly departmentId: string | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, title, institutionId, facultyId, departmentId, createdAt, updatedAt }: CourseConstructorArgs) {
		super()
		this.id = id
		this.title = title
		this.institutionId = institutionId
		this.facultyId = facultyId
		this.departmentId = departmentId
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type CourseConstructorArgs = {
	id: string
	title: string
	institutionId: string
	facultyId: string | null
	departmentId: string | null
	createdAt: number
	updatedAt: number
}
