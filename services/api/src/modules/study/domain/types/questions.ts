export enum QuestionTypes {
	multipleChoice = 'multipleChoice',
	trueOrFalse = 'trueOrFalse',
	writeAnswer = 'writeAnswer',
	fillInBlanks = 'fillInBlanks',
	dragAnswers = 'dragAnswers',
	sequence = 'sequence',
	match = 'match',
}

export type QuestionData = {
	type: QuestionTypes.multipleChoice,
	options: string[],
	answers: number[]
} | {
	type: QuestionTypes.trueOrFalse,
	answer: boolean
} | {
	type: QuestionTypes.writeAnswer,
	answers: string[]
} | {
	type: QuestionTypes.fillInBlanks,
	indicator: string,
	answers: string[]
} | {
	type: QuestionTypes.dragAnswers,
	indicator: string,
	answers: string[]
} | {
	type: QuestionTypes.sequence,
	answers: string[]
} | {
	type: QuestionTypes.match,
	set: { q: string, a: string }[]
}

export type StrippedQuestionData = {
	type: QuestionTypes.multipleChoice
	allowsMoreThanOneAnswer: boolean
	options: string[]
} | {
	type: QuestionTypes.trueOrFalse
} | {
	type: QuestionTypes.writeAnswer
} | {
	type: QuestionTypes.fillInBlanks
	indicator: string
} | {
	type: QuestionTypes.dragAnswers
	indicator: string
	answers: string[]
} | {
	type: QuestionTypes.sequence
	answers: string[]
} | {
	type: QuestionTypes.match
	questions: string[]
	answers: string[]
}