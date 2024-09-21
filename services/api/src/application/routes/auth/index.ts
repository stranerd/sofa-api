import { Router } from 'equipped'
import emails from './emails'
import identities from './identities'
import passwords from './passwords'
import phone from './phone'
import token from './token'
import user from './user'

const router = new Router({ path: '/auth', groups: ['Auth'] })
router.nest(emails, identities, passwords, phone, token, user)

export default router
