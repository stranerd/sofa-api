export { QuestionAnswer as PlayAnswer } from '@modules/study'
import { QuizModes as PlayTypes } from '@modules/study'

export { PlayTypes }

export { EmbeddedUser } from '@modules/users'

export enum PlayStatus {
	created = 'created',
	started = 'started',
	ended = 'ended',
	scored = 'scored',
}

export type PlayData =
	| {
			type: PlayTypes.games
			participants: string[]
	  }
	| {
			type: PlayTypes.assessments
			participants: string[]
			endedAt: number
	  }
	| {
			type: PlayTypes.tests
			forTutors: boolean
	  }
	| {
			type: PlayTypes.practice | PlayTypes.flashcards
	  }

export type PlayScore = { userId: string; value: number }[]
