import { isAuthenticatedButIgnoreVerified } from '@application/middlewares'
import { AuthResponse, AuthUseCases, AuthUsersUseCases, generateAuthOutput } from '@modules/auth'
import { ApiDef, AuthTypes, BadRequestError, Router, Schema, Validation, validate } from 'equipped'

const router = new Router({ path: '/emails', groups: ['Emails'] })

router.post<SigninRouteDef>({ path: '/signin', key: 'emails-signin' })(async (req) => {
	const validateData = validate(
		{
			email: Schema.string().email(),
			password: Schema.string(),
		},
		req.body,
	)

	const data = await AuthUseCases.authenticateUser(validateData)
	return await generateAuthOutput(data)
})

router.post<SignupRouteDef>({ path: '/signup', key: 'emails-signup' })(async (req) => {
	const user = await AuthUsersUseCases.findUserByEmail(req.body.email || '')

	const data = validate(
		{
			email: Schema.string()
				.email()
				.addRule((value) => {
					const email = value as string
					if (!user) return Validation.isValid(email)
					if (user.authTypes.includes(AuthTypes.email))
						return Validation.isInvalid(['this email already exists with a password attached'], email)
					return Validation.isValid(email)
				}),
			password: Schema.string().min(8).max(16),
		},
		req.body,
	)

	const updatedUser = user ? await AuthUsersUseCases.updateUserDetails({ userId: user.id, data }) : await AuthUseCases.registerUser(data)

	return await generateAuthOutput(updatedUser)
})

router.post<SendVerifyMailRouteDef>({
	path: '/verify/mail',
	key: 'emails-send-verify-mail',
	middlewares: [isAuthenticatedButIgnoreVerified],
})(async (req) => {
	const user = await AuthUsersUseCases.findUser(req.authUser!.id)
	if (!user) throw new BadRequestError('profile not found')
	return await AuthUseCases.sendVerificationMail(user.email)
})

router.post<VerifyEmailRouteDef>({ path: '/verify', key: 'emails-verify-email' })(async (req) => {
	const { token } = validate({ token: Schema.force.string() }, req.body)

	const data = await AuthUseCases.verifyEmail(token)
	return await generateAuthOutput(data)
})

export default router

type SigninRouteDef = ApiDef<{
	key: 'emails-signin'
	method: 'post'
	body: { email: string; password: string }
	response: AuthResponse
}>

type SignupRouteDef = ApiDef<{
	key: 'emails-signup'
	method: 'post'
	body: { email: string; password: string }
	response: AuthResponse
}>

type SendVerifyMailRouteDef = ApiDef<{
	key: 'emails-send-verify-mail'
	method: 'post'
	response: boolean
}>

type VerifyEmailRouteDef = ApiDef<{
	key: 'emails-verify-email'
	method: 'post'
	body: { token: string }
	response: AuthResponse
}>
