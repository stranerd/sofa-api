import { router } from '@application/routes'
import { PlansUseCases } from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { isProd, port } from '@utils/environment'
import { startJobs } from '@utils/jobs'
import { registerSockets } from '@utils/sockets'
import { appInstance } from '@utils/types'
import { initializeApp } from 'firebase-admin/app'

import schemas from '@application/schema.json'

const start = async () => {
	if (isProd) initializeApp()
	await appInstance.startConnections()

	await registerSockets()
	await UsersUseCases.resetAllUsersStatus()
	await PlansUseCases.init()
	appInstance.listener.callers = {
		onConnect: async (userId, socketId) => {
			await UsersUseCases.updateStatus({
				userId,
				socketId,
				add: true,
			})
		},
		onDisconnect: async (userId, socketId) => {
			await UsersUseCases.updateStatus({
				userId,
				socketId,
				add: false,
			})
		},
	}
	const app = appInstance.server
	app.addSchema(schemas)
	app.addRouter(router)
	await app.start(port)
	await startJobs()
}

start().then()
