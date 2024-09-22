import { isAuthenticated } from '@application/middlewares'
import { MethodEntity, MethodsUseCases } from '@modules/payment'
import { ApiDef, NotAuthorizedError, QueryParams, QueryResults, Router } from 'equipped'

const router = new Router({ path: '/methods', groups: ['Methods'], middlewares: [isAuthenticated] })

router.get<PaymentMethodsGetRouteDef>({ path: '/', key: 'payment-methods-get' })(async (req) => {
	const query = req.query
	query.auth = [{ field: 'userId', value: req.authUser!.id }]
	return await MethodsUseCases.get(query)
})

router.get<PaymentMethodsFindRouteDef>({ path: '/:id', key: 'payment-methods-find' })(async (req) => {
	const method = await MethodsUseCases.find(req.params.id)
	if (!method || method.userId !== req.authUser!.id) return null
	return method
})

router.put<PaymentMethodsMakePrimaryRouteDef>({ path: '/:id/primary', key: 'payment-methods-make-primary' })(async (req) => {
	const updated = await MethodsUseCases.makePrimary({ id: req.params.id, userId: req.authUser!.id })
	if (updated) return updated
	throw new NotAuthorizedError()
})

router.delete<PaymentMethodsDeleteRouteDef>({ path: '/:id', key: 'payment-methods-delete' })(async (req) => {
	const isDeleted = await MethodsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
	if (isDeleted) return isDeleted
	throw new NotAuthorizedError()
})

export default router

type PaymentMethodsGetRouteDef = ApiDef<{
	key: 'payment-methods-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<MethodEntity>
}>

type PaymentMethodsFindRouteDef = ApiDef<{
	key: 'payment-methods-find'
	method: 'get'
	params: { id: string }
	response: MethodEntity | null
}>

type PaymentMethodsMakePrimaryRouteDef = ApiDef<{
	key: 'payment-methods-make-primary'
	method: 'put'
	params: { id: string }
	response: MethodEntity
}>

type PaymentMethodsDeleteRouteDef = ApiDef<{
	key: 'payment-methods-delete'
	method: 'delete'
	params: { id: string }
	response: boolean
}>
