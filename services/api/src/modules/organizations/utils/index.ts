import { AuthUser } from 'equipped'
import { ClassesUseCases, MemberTypes, MembersUseCases } from '..'

export const canModOrgs = async (user: AuthUser, organizationId: string) => {
	if (user.id === organizationId) return 'admin'
	// support for org admins in future
	return null
}

export const canAccessOrgMembers = async (user: AuthUser, organizationId: string) => {
	return await canModOrgs(user, organizationId)
}

export const canAccessOrgClasses = async (user: AuthUser, organizationId: string, classId: string) => {
	const classInst = await ClassesUseCases.find(classId)
	if (!classInst || classInst.organizationId !== organizationId) return null
	const canModOrg = await canModOrgs(user, organizationId)
	if (canModOrg) return canModOrg
	const { results: members } = await MembersUseCases.get({
		where: [
			{ field: 'email', value: user.email },
			{ field: 'organizationId', value: organizationId }
		],
		all: true
	})
	if (members.some((m) => m.type === MemberTypes.teacher)) return 'teacher'
	if (members.some((m) => m.type === MemberTypes.student)) return 'student'
	return null
}