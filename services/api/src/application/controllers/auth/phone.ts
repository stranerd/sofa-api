import { AuthUseCases, generateAuthOutput } from '@modules/auth'
import { Request, Schema, validateReq, Validation } from 'equipped'

export class PhoneController {
	static async sendVerificationText (req: Request) {
		const { phone } = validateReq({
			phone: Schema.any().addRule(Validation.isValidPhone())
		}, req.body)

		return await AuthUseCases.sendVerificationText({
			id: req.authUser!.id, phone
		})
	}

	static async verifyPhone (req: Request) {
		const { token } = validateReq({
			token: Schema.force.string()
		}, req.body)

		const data = await AuthUseCases.verifyPhone(token)
		return await generateAuthOutput(data)
	}
}