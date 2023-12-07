export interface DashboardRepository {
  getTotalForEachCategory(userId: string): Promise<any>
  getGeneralDataOfUser(userId: string): Promise<any>
}
