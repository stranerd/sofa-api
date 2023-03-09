import { groupRoutes } from 'equipped'
import { emailRoutes } from './emails'
import { identitiesRoutes } from './identities'
import { passwordsRoutes } from './passwords'
import { phoneRoutes } from './phone'
import { tokenRoutes } from './token'
import { userRoutes } from './user'

export const authRoutes = groupRoutes('/auth', [
	...emailRoutes,
	...identitiesRoutes,
	...passwordsRoutes,
	...phoneRoutes,
	...tokenRoutes,
	...userRoutes
])