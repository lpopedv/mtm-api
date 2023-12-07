import { CategoryNotFoundError } from '@/errors/category-not-found-error'
import { CategoryRepository } from '@/interfaces/categories/category-repository.interface'
import { Category } from '@prisma/client'

export class DeleteCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private userId: string,
  ) {}

  async execute(id: string): Promise<Category> {
    const userId = this.userId

    const categoryExists = await this.categoryRepository.findById(id, userId)

    if (categoryExists === null) {
      throw new CategoryNotFoundError()
    }

    const deletedCategory = await this.categoryRepository.delete(id, userId)

    return deletedCategory
  }
}
