import { CategoryNotFoundError } from '@/errors/category-not-found-error'
import { CategoryRepository } from '@/interfaces/categories/category-repository.interface'

export class FindCategoryByIdUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string, userId: string) {
    const category = await this.categoryRepository.findById(id, userId)

    if (category === null) {
      throw new CategoryNotFoundError()
    }

    return category
  }
}
