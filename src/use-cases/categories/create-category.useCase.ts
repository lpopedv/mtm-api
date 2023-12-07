import { Category } from '@/@types/category'
import { CategoryAlreadyExistsError } from '@/errors/categories/category-already-exists-error'
import { CategoryRepository } from '@/interfaces/categories/category-repository.interface'
import { Prisma } from '@prisma/client'

export class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly userId: string,
  ) {}

  async execute({
    title,
    description,
  }: Category): Promise<Prisma.CategoryUncheckedCreateInput> {
    const categoryExists = await this.categoryRepository.findByTitle(
      title,
      this.userId,
    )

    if (categoryExists !== null) throw new CategoryAlreadyExistsError()

    const category = await this.categoryRepository.create({
      title,
      userId: this.userId,
      description,
    })

    return category
  }
}
