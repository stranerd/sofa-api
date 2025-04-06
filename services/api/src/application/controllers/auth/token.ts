import type { Request } from 'equipped'

import { getNewTokens } from '@modules/auth'

export class TokenController {
	static async getNewTokens(req: Request) {
		const accessToken = req.headers.AccessToken ?? ''
		const refreshToken = req.headers.RefreshToken ?? ''
		return await getNewTokens({ accessToken, refreshToken })
	}
}
