import { isAuthenticated } from '@application/middlewares'
import { PlanEntity, PlansUseCases } from '@modules/payment'
import { ApiDef, QueryParams, QueryResults, Router } from 'equipped'

const router = new Router({ path: '/plans', groups: ['Plans'], middlewares: [isAuthenticated] })

router.get<PaymentPlansGetRouteDef>({ path: '/', key: 'payment-plans-get' })(async (req) => {
	const query = req.query as QueryParams
	query.sort ??= []
	query.sort.push({ field: 'amount', desc: false })
	return await PlansUseCases.get(query)
})

router.get<PaymentPlansFindRouteDef>({ path: '/:id', key: 'payment-plans-find' })(async (req) => await PlansUseCases.find(req.params.id))

export default router

type PaymentPlansGetRouteDef = ApiDef<{
	key: 'payment-plans-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<PlanEntity>
}>

type PaymentPlansFindRouteDef = ApiDef<{
	key: 'payment-plans-find'
	method: 'get'
	params: { id: string }
	response: PlanEntity | null
}>
