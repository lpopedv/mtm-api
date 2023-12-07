import { CategoryNotFoundError } from '@/errors/categories/category-not-found-error'
import { CategoryRepository } from '@/interfaces/categories/category-repository.interface'

export class FindCategoryByIdUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly userId: string,
  ) {}

  async execute(id: string) {
    const category = await this.categoryRepository.findById(id, this.userId)

    if (category === null) {
      throw new CategoryNotFoundError()
    }

    return category
  }
}
