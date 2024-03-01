import { AuthUser } from 'equipped'
import { ClassesUseCases, MemberTypes, MembersUseCases } from '..'

export const canModOrgs = async (user: AuthUser, organizationId: string) => {
	if (user.id === organizationId) return 'admin'
	// support for org admins in future
	return null
}

export const canAccessOrgMembers = async (user: AuthUser, organizationId: string) => await canModOrgs(user, organizationId)

export const canAccessOrgClasses = async (user: AuthUser, organizationId: string, classId: string) => {
	const classInst = await ClassesUseCases.find(classId)
	if (!classInst || classInst.organizationId !== organizationId) return null
	const canModOrg = await canModOrgs(user, organizationId)
	if (canModOrg) return { class: classInst, role: 'admin' as const }
	if (classInst.lessons.some((l) => l.users.teachers.includes(user.id))) return { class: classInst, role: 'teacher' as const }
	if (classInst.members.students.includes(user.id)) return { class: classInst, role: 'student' as const }
	const { results: members } = await MembersUseCases.get({
		where: [
			{ field: 'email', value: user.email },
			{ field: 'organizationId', value: organizationId },
			{ field: 'accepted.is', value: true },
		],
		all: true,
	})
	// if (members.some((m) => m.type === MemberTypes.teacher)) return 'teacher'
	if (members.some((m) => m.type === MemberTypes.student)) return { class: classInst, role: 'student' as const }
	return { class: classInst, role: null }
}
