export { EmbeddedUser } from '@modules/users'
export { MediaOutput as Media } from 'equipped'
export * from './questions'

import { Currencies } from '@modules/payment'

export enum FolderSaved {
	quizzes = 'quizzes'
}

export enum DraftStatus {
	draft = 'draft',
	published = 'published',
	frozen = 'frozen'
}

export type Publishable = {
	tagId: string
	status: DraftStatus
	price: {
		amount: number
		currency: Currencies
	}
}