import { appInstance } from '@utils/types'
import { CoursableDataSchema } from '.'
import { FileDbChangeCallbacks } from '../../utils/changes/files'
import { FileMapper } from '../mappers/files'
import { FileFromModel } from '../models/files'

const Schema = new appInstance.dbs.mongo.Schema<FileFromModel>({
	...CoursableDataSchema,
	type: {
		type: String,
		required: true
	},
	media: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	}
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const File = appInstance.dbs.mongo.use('study').model<FileFromModel>('File', Schema)

export const FileChange = appInstance.dbs.mongo.change(File, FileDbChangeCallbacks, new FileMapper().mapFrom)