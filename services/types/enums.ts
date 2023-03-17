import { makeEnum } from 'equipped'

const Ar = makeEnum('AuthRole', {
	isAdmin: 'isAdmin',
	isTutor: 'isTutor',
	isVerified: 'isVerified',
	isSuperAdmin: 'isSuperAdmin',
	isSubscribed: 'isSubscribed'
} as const)

const El = makeEnum('EmailsList', {
	NO_REPLY: 'no-reply@stranerd.com'
} as const)

const Ev = makeEnum('EventTypes', {
	SENDMAIL: 'SENDMAIL',
	SENDTEXT:'SENDTEXT',
	DELETEFILE: 'DELETEFILE'
} as const)

const Dj = makeEnum('DelayedJobs', {
	RenewSubscription: 'RenewSubscription',
} as const)

const Clj = makeEnum('CronLikeJobs', {} as const)

declare module 'equipped/lib/enums/types' {
	type TAr = typeof Ar
	type TEl = typeof El
	type TEv = typeof Ev
	type TDj = typeof Dj
	type TClj = typeof Clj
    interface IAuthRole extends TAr {}
    interface IEmailsList extends TEl {}
    interface IEventTypes extends TEv {}
    interface IDelayedJobs extends TDj {}
    interface ICronLikeJobs extends TClj {}
}