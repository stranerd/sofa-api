import { BaseEntity } from 'equipped'

export class FacultyEntity extends BaseEntity<FacultyConstructorArgs> {
	constructor(data: FacultyConstructorArgs) {
		super(data)
	}
}

type FacultyConstructorArgs = { id: string; title: string; institutionId: string; createdAt: number; updatedAt: number }
