import { UsersUseCases } from '@modules/users'

export const canAccessOrg = async (userId: string, organizationId: string) => {
	if (userId !== organizationId) return null
	const org = await UsersUseCases.find(organizationId)
	if (!org || org.isDeleted() || !org.isOrg()) return null
	return org
}