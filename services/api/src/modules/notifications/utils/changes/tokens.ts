import type { DbChangeCallbacks } from 'equipped'

import type { TokenFromModel } from '../../data/models/tokens'
import type { TokenEntity } from '../../domain/entities/tokens'

export const TokenDbChangeCallbacks: DbChangeCallbacks<TokenFromModel, TokenEntity> = {}
