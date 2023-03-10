import { FlashCardRepository } from './data/repositories/cards'
import { FolderRepository } from './data/repositories/folders'
import { CardsUseCase } from './domain/useCases/cards'
import { FoldersUseCase } from './domain/useCases/folders'

const flashCardRepository = FlashCardRepository.getInstance()
const folderRepository = FolderRepository.getInstance()

export const FlashCardsUseCases = new CardsUseCase(flashCardRepository)
export const FoldersUseCases = new FoldersUseCase(folderRepository)
