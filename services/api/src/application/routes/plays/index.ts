import { groupRoutes } from 'equipped'

import { answersRoutes } from './answers'
import { playsRoutes } from './plays'

export const playRoutes = groupRoutes({ path: '/plays' }, [...playsRoutes, ...answersRoutes])
