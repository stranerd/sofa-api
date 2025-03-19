import { render } from '@vue-email/render'
import path from 'path'
import { createServer } from 'vite'

export interface PropTypes {
	AccountCreated: {}
	AccountDeleted: {}
	NewFormMessage: { name: string; email: string; message: string; phone: string }
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
	'NewFormMessage',
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

const dirname = path.join(process.cwd(), 'emails')

async function loadEmails() {
	const server = await createServer({
		configFile: path.resolve(dirname, 'vite.config.ts'),
		mode: 'production',
		server: { middlewareMode: true },
		optimizeDeps: { include: ['vue', '@vue-email/render'] },
	})

	const emailComponents = emails.map(async (email) => {
		const module = await server.ssrLoadModule(path.resolve(dirname, `emails/${email}.vue`))
		return [email, module.default]
	})
	const e = await Promise.all(emailComponents)

	await server.close()

	return Object.fromEntries(e) as Record<string, object>
}

const emailComponents = loadEmails()

export async function renderEmail<T extends keyof PropTypes>(email: T, props: PropTypes[T]) {
	const emailComponent = (await emailComponents)[email]
	if (!emailComponent) throw new Error(`Email template not found for ${email}`)
	return render(emailComponent, props as any, { pretty: true }).catch(() => {
		throw new Error(`Failed to retrieve email content for ${email}`)
	})
}
