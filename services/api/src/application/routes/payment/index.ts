import { groupRoutes } from 'equipped'
import { methodsRoutes } from './methods'
import { plansRoutes } from './plans'
import { transactionsRoutes } from './transactions'
import { walletsRoutes } from './wallets'

export const paymentRoutes = groupRoutes('/payment', [
	...plansRoutes,
	...transactionsRoutes,
	...methodsRoutes,
	...walletsRoutes
])