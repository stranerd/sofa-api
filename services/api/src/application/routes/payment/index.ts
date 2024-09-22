import { Router } from 'equipped'
import methods from './methods'
import plans from './plans'
import purchases from './purchases'
import transactions from './transactions'
import wallets from './wallets'
import withdrawals from './withdrawals'

const router = new Router({ path: '/payment', groups: ['Payment'] })

router.nest(methods, plans, purchases, transactions, wallets, withdrawals)

export default router
