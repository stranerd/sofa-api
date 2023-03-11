export { EmbeddedUser } from '@modules/users'

import { Currencies } from '@modules/payment'
import { MediaOutput } from 'equipped'

export type Media = MediaOutput

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