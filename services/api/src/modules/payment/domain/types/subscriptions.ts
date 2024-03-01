export type Subscription = {
	active: boolean
	methodId: string | null
	current: {
		activatedAt: number
		expiredAt: number
		jobId: string | null
	} | null
	next: {
		renewedAt: number
	} | null
	data: {
		type: 'classes'
		organizationId: string
		classId: string
	}
}
