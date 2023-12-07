import { CategoryRepository } from '@/interfaces/categories/category-repository.interface'
import { Prisma } from '@prisma/client'

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute({
    title,
    description,
    userId,
  }: Prisma.CategoryUncheckedCreateInput): Promise<Prisma.CategoryUncheckedCreateInput> {
    const newCategory = await this.categoryRepository.create({
      title,
      userId,
      description,
    })

    return newCategory
  }
}
