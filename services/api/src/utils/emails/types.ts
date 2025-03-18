export interface PropTypes {
	AccountCreated: {}
	AccountDeleted: {}
	NewNotification: { title: string; body: string; link: string }
	OrgMemberRequest: { name: string }
	OrgMemberRequestAccepted: { orgName: string }
	SendOTP: { token: string }
	SubscriptionExpiringSoon: { name: string; planName: string }
	SubscriptionPaymentSuccessful: { planName: string }
	TutorApplicationRequest: { name: string }
	TutorApplicationRequestAccepted: {}
	WithdrawalRequested: {}
}

export const emails: (keyof PropTypes)[] = [
	'AccountCreated',
	'AccountDeleted',
	'NewNotification',
	'OrgMemberRequest',
	'OrgMemberRequestAccepted',
	'SendOTP',
	'SubscriptionExpiringSoon',
	'SubscriptionPaymentSuccessful',
	'TutorApplicationRequest',
	'TutorApplicationRequestAccepted',
	'WithdrawalRequested',
]
