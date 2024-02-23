import { BaseEntity } from 'equipped'
import { MethodData } from '../types'

export class MethodEntity extends BaseEntity<MethodConstructorArgs> {
	constructor(data: MethodConstructorArgs) {
		super(data)
	}
}

type MethodConstructorArgs = {
	id: string
	data: MethodData
	token: string
	primary: boolean
	userId: string
	createdAt: number
	updatedAt: number
}
