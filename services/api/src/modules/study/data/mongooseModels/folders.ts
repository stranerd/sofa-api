import { appInstance } from '@utils/types'
import { FolderSaved } from '../../domain/types'
import { FolderDbChangeCallbacks } from '../../utils/changes/folders'
import { FolderMapper } from '../mappers/folders'
import { FolderFromModel } from '../models/folders'

const Schema = new appInstance.dbs.mongo.Schema<FolderFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	title: {
		type: String,
		required: false,
		default: ''
	},
	saved: Object.fromEntries(
		Object.keys(FolderSaved).map((key) => [key, {
			type: [String],
			required: false,
			default: []
		}])
	),
	user: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	createdAt: {
		type: Number,
		required: false,
		default: Date.now
	},
	updatedAt: {
		type: Number,
		required: false,
		default: Date.now
	}
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const Folder = appInstance.dbs.mongo.use('study').model<FolderFromModel>('Folder', Schema)

export const FolderChange = appInstance.dbs.mongo.change(Folder, FolderDbChangeCallbacks, new FolderMapper().mapFrom)