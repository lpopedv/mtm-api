import { Category } from '@/@types/category'
import { CategoryNotFoundError } from '@/errors/categories/category-not-found-error'
import { CategoryRepository } from '@/interfaces/categories/category-repository.interface'

export class UpdateCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly userId: string,
  ) {}

  async execute(id: string, data: Category) {
    const categoryExists = await this.categoryRepository.findById(
      id,
      this.userId,
    )

    if (categoryExists === null) throw new CategoryNotFoundError()

    const category = await this.categoryRepository.update(id, data, this.userId)

    return category
  }
}
