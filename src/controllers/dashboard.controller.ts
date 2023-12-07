import { PrismaDashboardRepository } from '@/repositories/prisma/PrismaDashboardRepository'
import { GetTotalForEachCategoryUseCase } from '@/use-cases/dashboard/get-total-foreach-category'
import { FastifyReply, FastifyRequest } from 'fastify'

export class DashboardController {
  async getDashboardData(request: FastifyRequest, reply: FastifyReply) {
    try {
      // await request.jwtVerify()
      // const userId = request.user.sub
      const userId = 'e4f6f53a-7a1d-44ac-a9e7-7fdf51f190c4'
      const dashboardRepository = new PrismaDashboardRepository()

      const getTotalForEachCategoryUseCase = new GetTotalForEachCategoryUseCase(
        dashboardRepository,
      )

      const expensesByCategory =
        await getTotalForEachCategoryUseCase.execute(userId)

      const generalUserData =
        await dashboardRepository.getGeneralDataOfUser(userId)

      const finalData = {
        expensesByCategory,
        generalUserData,
      }

      return reply.send(finalData)
    } catch (error) {
      return reply.status(500).send(error)
    }
  }
}
