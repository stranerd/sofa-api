import { MediaInput, MediaOutput } from '../../data/models/media'

export interface IUploaderRepository {
	upload: (path: string, media: MediaInput) => Promise<MediaOutput>
	delete: (path: string) => Promise<boolean>
}