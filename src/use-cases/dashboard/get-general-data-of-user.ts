import { DashboardRepository } from '@/interfaces/dashboard/dashboard-repository.interface'

export class GetGeneralDataOfUserUseCase {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute(userId: string) {
    const dashboardRepository =
      await this.dashboardRepository.getGeneralDataOfUser(userId)

    const data = {
      monthlyIncome: dashboardRepository.monthlyIncome,
      totalExpenses: dashboardRepository.totalExpenses,
      totalBalance: dashboardRepository.totalBalance,
    }

    return data
  }
}
