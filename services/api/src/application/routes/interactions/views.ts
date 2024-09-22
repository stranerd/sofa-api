import { isAuthenticated } from '@application/middlewares'
import { EntitySchema, InteractionEntity, ViewEntity, ViewsUseCases, verifyInteraction } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { ApiDef, BadRequestError, QueryKeys, QueryParams, QueryResults, Router, validate } from 'equipped'

const router = new Router({ path: '/views', groups: ['Views'], middlewares: [isAuthenticated] })

router.get<InteractionsViewsGetRouteDef>({ path: '/', key: 'interactions-views-get' })(async (req) => {
	const query = req.query
	const userId = req.authUser!.id
	query.authType = QueryKeys.or
	query.auth = [
		{ field: 'entity.userId', value: userId },
		{ field: 'user.id', value: userId },
	]
	return await ViewsUseCases.get(query)
})

router.get<InteractionsViewsFindRouteDef>({ path: '/:id', key: 'interactions-views-find' })(async (req) => {
	const view = await ViewsUseCases.find(req.params.id)
	const userId = req.authUser!.id
	if (!view) return null
	if (view.user.id !== userId && view.entity.userId !== userId) return null
	return view
})

router.post<InteractionsViewsCreateRouteDef>({ path: '/', key: 'interactions-views-create' })(async (req) => {
	const data = validate(
		{
			entity: EntitySchema(),
		},
		req.body,
	)

	const entity = await verifyInteraction(data.entity, 'views')
	const user = await UsersUseCases.find(req.authUser!.id)
	if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

	return await ViewsUseCases.create({
		entity,
		user: user.getEmbedded(),
	})
})

export default router

type InteractionsViewsGetRouteDef = ApiDef<{
	key: 'interactions-views-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<ViewEntity>
}>

type InteractionsViewsFindRouteDef = ApiDef<{
	key: 'interactions-views-find'
	method: 'get'
	params: { id: string }
	response: ViewEntity | null
}>

type InteractionsViewsCreateRouteDef = ApiDef<{
	key: 'interactions-views-create'
	method: 'post'
	request: { entity: Omit<InteractionEntity, 'userId'> }
	response: ViewEntity
}>
