import { isAuthenticatedButIgnoreVerified } from '@application/middlewares'
import { AuthUseCases, AuthResponse, Phone, generateAuthOutput } from '@modules/auth'
import { ApiDef, Router, Schema, validate, Validation } from 'equipped'

const router = new Router({ path: '/phone', groups: ['Phone'] })

router.post<SendVerifyTextRouteDef>({
	path: '/verify/text',
	key: 'phone-send-verify-text',
	middlewares: [isAuthenticatedButIgnoreVerified],
})(async (req) => {
	const { phone } = validate(
		{
			phone: Schema.any().addRule(Validation.isValidPhone()),
		},
		req.body,
	)

	return await AuthUseCases.sendVerificationText({
		id: req.authUser!.id,
		phone,
	})
})

router.post<VerifyPhoneRouteDef>({ path: '/verify', key: 'phone-verify-phone' })(async (req) => {
	const { token } = validate(
		{
			token: Schema.force.string(),
		},
		req.body,
	)

	const data = await AuthUseCases.verifyPhone(token)
	return await generateAuthOutput(data)
})

export default router

type SendVerifyTextRouteDef = ApiDef<{
	key: 'phone-send-verify-text'
	method: 'post'
	body: { phone: Phone }
	response: boolean
}>

type VerifyPhoneRouteDef = ApiDef<{
	key: 'phone-verify-phone'
	method: 'post'
	body: { token: string }
	response: AuthResponse
}>
