import type { EmbeddedUser, FolderSaved } from '../../domain/types'

export interface FolderFromModel extends FolderToModel {
	_id: string
	saved: Record<FolderSaved, string[]>
	createdAt: number
	updatedAt: number
}

export interface FolderToModel {
	title: string
	user: EmbeddedUser
}
