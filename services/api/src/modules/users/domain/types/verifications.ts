export enum VerificationSocials {
	website = 'website',
	facebook = 'facebook',
	twitter = 'twitter',
	instagram = 'instagram',
	linkedIn = 'linkedIn',
	youtube = 'youtube',
	tiktok = 'tiktok',
}

export type VerificationSocialsType = Record<VerificationSocials, string>

export type VerificationContent = {
	courses: string[]
	quizzes: string[]
}