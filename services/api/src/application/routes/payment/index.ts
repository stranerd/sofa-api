import { groupRoutes } from 'equipped'
import { methodsRoutes } from './methods'
import { plansRoutes } from './plans'
import { purchasesRoutes } from './purchases'
import { transactionsRoutes } from './transactions'
import { walletsRoutes } from './wallets'

export const paymentRoutes = groupRoutes('/payment', [
	...plansRoutes,
	...purchasesRoutes,
	...transactionsRoutes,
	...methodsRoutes,
	...walletsRoutes
])