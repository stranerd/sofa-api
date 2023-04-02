import { appInstance } from '@utils/types'
import { GameDbChangeCallbacks } from '../../utils/changes/games'
import { GameMapper } from '../mappers/games'
import { GameFromModel } from '../models/games'

const Schema = new appInstance.dbs.mongo.Schema<GameFromModel>({
	_id: {
		type: String,
		default: () => appInstance.dbs.mongo.Id.toString()
	},
	quizId: {
		type: String,
		required: true
	},
	user: {
		type: appInstance.dbs.mongo.Schema.Types.Mixed,
		required: true
	},
	participants: {
		type: [String],
		required: false,
		default: []
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

export const Game = appInstance.dbs.mongo.use('plays').model<GameFromModel>('Game', Schema)

export const GameChange = appInstance.dbs.mongo.change(Game, GameDbChangeCallbacks, new GameMapper().mapFrom)