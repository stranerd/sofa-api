export type VerificationContent = {
	courses: string[]
	quizzes: string[]
}

export type VerificationAcceptType = {
	is: boolean
	message: string
	at: number
} | null

export type AcceptVerificationInput = {
	accept: boolean
	message: string
}
