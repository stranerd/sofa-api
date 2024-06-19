import { groupRoutes } from 'equipped'
import { coursesRoutes } from './courses'
import { departmentsRoutes } from './departments'
import { facultiesRoutes } from './faculties'
import { institutionsRoutes } from './institutions'

export const schoolRoutes = groupRoutes({ path: '/school' }, [
	...coursesRoutes,
	...departmentsRoutes,
	...facultiesRoutes,
	...institutionsRoutes,
])
