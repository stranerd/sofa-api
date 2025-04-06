import type { Request } from 'equipped'
import { Schema, validate, Validation } from 'equipped'

import { AuthUseCases, generateAuthOutput } from '@modules/auth'

export class PhoneController {
	static async sendVerificationText(req: Request) {
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
	}

	static async verifyPhone(req: Request) {
		const { token } = validate(
			{
				token: Schema.force.string(),
			},
			req.body,
		)

		const data = await AuthUseCases.verifyPhone(token)
		return await generateAuthOutput(data)
	}
}
