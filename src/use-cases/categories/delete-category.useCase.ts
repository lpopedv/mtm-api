import { CategoryNotFoundError } from '@/errors/categories/category-not-found-error'
import { CategoryRepository } from '@/interfaces/categories/category-repository.interface'

export class DeleteCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private userId: string,
  ) {}

  async execute(id: string) {
    const categoryExists = await this.categoryRepository.findById(
      id,
      this.userId,
    )

    if (categoryExists === null) {
      throw new CategoryNotFoundError()
    }

    const deletedCategory = await this.categoryRepository.delete(
      id,
      this.userId,
    )

    return deletedCategory
  }
}
