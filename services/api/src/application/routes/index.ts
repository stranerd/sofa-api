import { Router } from 'equipped'
import auth from './auth'
import conversations from './conversations'
import interactions from './interactions'
import meta from './meta'
import notifications from './notifications'
import organizations from './organizations'
import payment from './payment'
import plays from './plays'
import school from './school'
import study from './study'
import users from './users'

export const router = new Router()
router.nest(auth, conversations, interactions, meta, notifications, organizations, payment, plays, school, study, users)
