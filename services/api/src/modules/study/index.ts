import { CardRepository } from './data/repositories/cards'
import { FolderRepository } from './data/repositories/folders'
import { CardsUseCase } from './domain/useCases/cards'
import { FoldersUseCase } from './domain/useCases/folders'

const cardRepository = CardRepository.getInstance()
const folderRepository = FolderRepository.getInstance()

export const CardsUseCases = new CardsUseCase(cardRepository)
export const FoldersUseCases = new FoldersUseCase(folderRepository)

export { DraftStatus, FolderSaved } from './domain/types'
