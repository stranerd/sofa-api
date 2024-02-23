import { BaseEntity } from 'equipped'

export class DepartmentEntity extends BaseEntity<DepartmentConstructorArgs> {
	constructor(data: DepartmentConstructorArgs) {
		super(data)
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
