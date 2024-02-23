import { BaseEntity } from 'equipped'

export class InstitutionEntity extends BaseEntity<InstitutionConstructorArgs> {
	constructor(data: InstitutionConstructorArgs) {
		super(data)
	}
}

type InstitutionConstructorArgs = {
	id: string
	title: string
	isGateway: boolean
	createdAt: number
	updatedAt: number
}
