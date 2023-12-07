import { CategoryRepository } from '@/interfaces/categories/category-repository.interface'

export class FindManyCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly userId: string,
  ) {}

  async execute() {
    const categories = await this.categoryRepository.findMany(this.userId)
    return categories
  }
}
