import { AuthUseCases, AuthUsersUseCases, generateAuthOutput } from '@modules/auth'
import { AuthTypes, BadRequestError, Request, Schema, validate, Validation } from 'equipped'

export class EmailsController {
	static async signup(req: Request) {
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

		const updatedUser = user
			? await AuthUsersUseCases.updateUserDetails({ userId: user.id, data })
			: await AuthUseCases.registerUser(data)

		return await generateAuthOutput(updatedUser)
	}

	static async signin(req: Request) {
		const validateData = validate(
			{
				email: Schema.string().email(),
				password: Schema.string(),
			},
			req.body,
		)

		const data = await AuthUseCases.authenticateUser(validateData)
		return await generateAuthOutput(data)
	}

	static async sendVerificationMail(req: Request) {
		const user = await AuthUsersUseCases.findUser(req.authUser!.id)
		if (!user) throw new BadRequestError('profile not found')
		return await AuthUseCases.sendVerificationMail(user.email)
	}

	static async verifyEmail(req: Request) {
		const { token } = validate(
			{
				token: Schema.force.string(),
			},
			req.body,
		)

		const data = await AuthUseCases.verifyEmail(token)
		return await generateAuthOutput(data)
	}
}
