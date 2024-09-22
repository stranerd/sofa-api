import { isAuthenticated } from '@application/middlewares'
import { WithdrawalEntity, WithdrawalsUseCases } from '@modules/payment'
import { ApiDef, QueryParams, QueryResults, Router } from 'equipped'

const router = new Router({ path: '/withdrawals', groups: ['Withdrawals'], middlewares: [isAuthenticated] })

router.get<PaymentWithdrawalsGetRouteDef>({ path: '/', key: 'payment-withdrawals-get' })(async (req) => {
	const query = req.query as QueryParams
	query.auth = [{ field: 'userId', value: req.authUser!.id }]
	return await WithdrawalsUseCases.get(query)
})

router.get<PaymentWithdrawalsFindRouteDef>({ path: '/:id', key: 'payment-withdrawals-find' })(async (req) => {
	const withdrawal = await WithdrawalsUseCases.find(req.params.id)
	if (!withdrawal || withdrawal.userId !== req.authUser!.id) return null
	return withdrawal
})

export default router

type PaymentWithdrawalsGetRouteDef = ApiDef<{
	key: 'payment-withdrawals-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<WithdrawalEntity>
}>

type PaymentWithdrawalsFindRouteDef = ApiDef<{
	key: 'payment-withdrawals-find'
	method: 'get'
	params: { id: string }
	response: WithdrawalEntity | null
}>
