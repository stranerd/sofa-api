import { render } from '@vue-email/render'
import path from 'path'
import { createServer } from 'vite'
import { emails, type PropTypes } from './types'

export { emails, type PropTypes }

const dirname = __dirname

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
