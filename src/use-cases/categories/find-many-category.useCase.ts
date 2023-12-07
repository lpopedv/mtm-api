import { CategoryRepository } from '@/interfaces/categories/category-repository.interface'

export class FindManyCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private userId: string,
  ) {}

  async execute() {
    const userId = this.userId
    const categories = await this.categoryRepository.findMany(userId)

    return categories
  }
}
