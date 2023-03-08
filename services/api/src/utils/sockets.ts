import { appInstance } from '@utils/types'
import { OnJoinFn } from 'equipped'

export const registerSockets = () => {
	const isOpen: OnJoinFn = async ({ channel }) => channel

	appInstance.listener.register('users/users', isOpen)
}