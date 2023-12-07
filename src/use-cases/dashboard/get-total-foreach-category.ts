import { DashboardRepository } from '@/interfaces/dashboard/dashboard-repository.interface'

export class GetTotalForEachCategoryUseCase {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute(userId: string): Promise<any> {
    const dashboardRepository =
      await this.dashboardRepository.getTotalForEachCategory(userId)

    const data = dashboardRepository.map((item) => {
      return {
        title: item.title,
        amount: item.amount,
      }
    })

    return data
  }
}
