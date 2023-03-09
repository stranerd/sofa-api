import { appInstance } from '@utils/types'
import { TagDbChangeCallbacks } from '../../utils/changes/tags'
import { TagMapper } from '../mappers/tags'
import { TagFromModel } from '../models/tags'

const Schema = new appInstance.dbs.mongo.Schema<TagFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	type: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	parent: {
		type: String,
		required: false,
		default: null
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

export const Tag = appInstance.dbs.mongo.use('interactions').model<TagFromModel>('Tag', Schema)

export const TagChange = appInstance.dbs.mongo.change(Tag, TagDbChangeCallbacks, new TagMapper().mapFrom)