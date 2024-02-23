import { BaseEntity } from 'equipped'

export class TokenEntity extends BaseEntity<TokenConstructor> {
	constructor(data: TokenConstructor) {
		super(data)
	}
}

type TokenConstructor = {
	id: string
	tokens: string[]
	userId: string
	createdAt: number
	updatedAt: number
}
