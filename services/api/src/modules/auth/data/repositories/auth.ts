import type { Enum, MediaOutput } from 'equipped'
import { AuthTypes, BadRequestError, EmailsList, Hash, Random, signinWithApple, signinWithGoogle, ValidationError } from 'equipped'

import { renderEmail } from '@utils/emails'
import { publishers } from '@utils/events'
import { appInstance } from '@utils/types'

import type { IAuthRepository } from '../../domain/irepositories/auth'
import type { Credential, PasswordResetInput, Phone } from '../../domain/types'
import { UserMapper } from '../mappers/users'
import type { UserFromModel, UserToModel } from '../models/users'
import { User } from '../mongooseModels/users'

const TOKENS_TTL_IN_SECS = 60 * 60

export class AuthRepository implements IAuthRepository {
	private static instance: AuthRepository
	private mapper = new UserMapper()

	private constructor() {
		this.mapper = new UserMapper()
	}

	static getInstance() {
		if (!AuthRepository.instance) AuthRepository.instance = new AuthRepository()
		return AuthRepository.instance
	}

	async addNewUser(data: UserToModel, type: Enum<typeof AuthTypes>) {
		data.email = data.email.toLowerCase()
		if (data.password) data.password = await Hash.hash(data.password)
		const userData = await new User(data).save()
		return this.signInUser(userData, type)
	}

	async authenticateUser(details: Credential, passwordValidate: boolean, type: Enum<typeof AuthTypes>) {
		details.email = details.email.toLowerCase()
		const user = await User.findOne({ email: details.email })
		if (!user) throw new ValidationError([{ field: 'email', messages: ['No account with such email exists'] }])

		const match = passwordValidate
			? user.authTypes.includes(AuthTypes.email)
				? await Hash.compare(details.password, user.password)
				: false
			: true

		if (!match) throw new ValidationError([{ field: 'password', messages: ['Invalid password'] }])

		return this.signInUser(user, type)
	}

	async sendVerificationMail(email: string) {
		email = email.toLowerCase()
		const token = Random.number(1e5, 1e6).toString()

		// save to cache
		await appInstance.cache.set('email-verification-token-' + token, email, TOKENS_TTL_IN_SECS)

		// send verification mail
		const content = await renderEmail('SendOTP', { token })
		await publishers.SENDMAIL.publish({
			to: email,
			subject: 'Verify Your Email',
			from: EmailsList.NO_REPLY,
			content,
			data: {},
		})

		return true
	}

	async verifyEmail(token: string) {
		// check token in cache
		const userEmail = await appInstance.cache.get('email-verification-token-' + token)
		if (!userEmail) throw new BadRequestError('Invalid token')
		await appInstance.cache.delete('email-verification-token-' + token)

		const user = await User.findOneAndUpdate({ email: userEmail }, { $set: { isEmailVerified: true } }, { new: true })
		if (!user) throw new BadRequestError('No account with saved email exists')

		return this.mapper.mapFrom(user)!
	}

	async sendVerificationText(id: string, phone: Phone) {
		const number = [phone.code, phone.number]
		const token = Random.number(1e5, 1e6).toString()

		// save to cache
		await appInstance.cache.set('phone-verification-token-' + token, number.concat(id).join('|'), TOKENS_TTL_IN_SECS)

		// send verification text
		await publishers.SENDTEXT.publish({
			to: number.join(''),
			content: `Your Stranerd API verification code is: ${token}`,
			from: 'Stranerd',
		})

		return true
	}

	async verifyPhone(token: string) {
		// check token in cache
		const userPhone = await appInstance.cache.get('phone-verification-token-' + token)
		if (!userPhone) throw new BadRequestError('Invalid token')
		await appInstance.cache.delete('phone-verification-token-' + token)
		const [code, number, id] = userPhone.split('|')

		const user = await User.findByIdAndUpdate(id, { $set: { phone: { code, number } } }, { new: true })
		if (!user) throw new BadRequestError('No user found')

		return this.mapper.mapFrom(user)!
	}

	async sendPasswordResetMail(email: string) {
		email = email.toLowerCase()
		const token = Random.number(1e5, 1e6).toString()

		// save to cache
		await appInstance.cache.set('password-reset-token-' + token, email, TOKENS_TTL_IN_SECS)

		// send reset password mail
		const content = await renderEmail('SendOTP', { token })
		await publishers.SENDMAIL.publish({
			to: email,
			subject: 'Reset Your Password',
			from: EmailsList.NO_REPLY,
			content,
			data: {},
		})

		return true
	}

	async resetPassword(input: PasswordResetInput) {
		// check token in cache
		const userEmail = await appInstance.cache.get('password-reset-token-' + input.token)
		if (!userEmail) throw new BadRequestError('Invalid token')
		await appInstance.cache.delete('password-reset-token-' + input.token)

		const user = await User.findOneAndUpdate(
			{ email: userEmail },
			{
				$set: { password: await Hash.hash(input.password) },
				$addToSet: { authTypes: AuthTypes.email },
			},
			{ new: true },
		)
		if (!user) throw new BadRequestError('No account with saved email exists')

		return this.mapper.mapFrom(user)!
	}

	async googleSignIn(idToken: string) {
		const data = await signinWithGoogle(idToken)
		const email = data.email!.toLowerCase()

		const photo = data.picture ? ({ link: data.picture, type: 'image/png' } as unknown as MediaOutput) : null

		return this.authorizeSocial(AuthTypes.google, {
			email,
			photo,
			name: { first: data.first_name, last: data.last_name },
			isEmailVerified: data.email_verified === 'true',
		})
	}

	async appleSignIn({ idToken, firstName, lastName }) {
		const data = await signinWithApple(idToken).catch((e: any) => {
			throw new BadRequestError(e.message)
		})
		const email = data.email?.toLowerCase()
		if (!email) throw new BadRequestError('cant access your email. Signin another way')

		return this.authorizeSocial(AuthTypes.apple, {
			email,
			photo: null,
			name: { first: firstName ?? 'Apple User', last: lastName ?? '' },
			isEmailVerified: data.email_verified === 'true',
		})
	}

	private async authorizeSocial(type: Enum<typeof AuthTypes>, data: Pick<UserToModel, 'email' | 'name' | 'photo' | 'isEmailVerified'>) {
		const userData = await User.findOne({ email: data.email })

		if (!userData)
			return await this.addNewUser(
				{
					name: {
						first: data.name.first ?? '',
						last: data.name.last ?? '',
					},
					description: '',
					email: data.email,
					photo: data.photo,
					authTypes: [type],
					password: '',
					phone: null,
					isEmailVerified: data.isEmailVerified,
				},
				type,
			)

		return await this.authenticateUser(
			{
				email: userData.email,
				password: '',
			},
			false,
			type,
		)
	}

	private async signInUser(user: UserFromModel, type: Enum<typeof AuthTypes>) {
		const userUpdated = await User.findByIdAndUpdate(
			user._id,
			{
				$set: { lastSignedInAt: Date.now() },
				$addToSet: { authTypes: [type] },
			},
			{ new: true },
		)

		return this.mapper.mapFrom(userUpdated)!
	}
}
