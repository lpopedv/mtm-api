import { CategoryRepository } from '@/interfaces/users/category-repository.interface'
import { Prisma } from '@prisma/client'

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string, data: Prisma.CategoryUncheckedCreateInput) {
    const category = await this.categoryRepository.update(id, data)

    return category
  }
}
