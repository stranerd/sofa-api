import { makeEnum } from 'equipped'

const _Ar = makeEnum('AuthRole', {
	isAdmin: 'isAdmin',
	isVerified: 'isVerified',
	isSuperAdmin: 'isSuperAdmin',
	isSubscribed: 'isSubscribed',
	isOfficialAccount: 'isOfficialAccount',
} as const)

const _El = makeEnum('EmailsList', {
	NO_REPLY: 'no-reply@stranerd.com',
} as const)

const _Ev = makeEnum('EventTypes', {
	SENDMAIL: 'SENDMAIL',
	SENDTEXT: 'SENDTEXT',
	DELETEFILE: 'DELETEFILE',
} as const)

const _Dj = makeEnum('DelayedJobs', {
	RenewSubscription: 'RenewSubscription',
	RenewGenericSubscription: 'RenewGenericSubscription',
	PlayTimer: 'PlayTimer',
	PlayAnswerTimer: 'PlayAnswerTimer',
} as const)

const _Clj = makeEnum('CronLikeJobs', {} as const)

declare module 'equipped/lib/enums/types' {
	type TAr = typeof _Ar
	type TEl = typeof _El
	type TEv = typeof _Ev
	type TDj = typeof _Dj
	type TClj = typeof _Clj
	interface IAuthRole extends TAr {}
	interface IEmailsList extends TEl {}
	interface IEventTypes extends TEv {}
	interface IDelayedJobs extends TDj {}
	interface ICronLikeJobs extends TClj {}
}
