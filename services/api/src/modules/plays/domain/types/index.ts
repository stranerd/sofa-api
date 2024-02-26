export { EmbeddedUser } from '@modules/users'

export enum PlayStatus {
	created = 'created',
	started = 'started',
	ended = 'ended',
	scored = 'scored',
}

export enum PlayTypes {
	practice = 'practice',
	tests = 'tests',
	games = 'games',
	flashcards = 'flashcards',
}
