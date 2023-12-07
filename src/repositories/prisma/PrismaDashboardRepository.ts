import { prismaClient } from '@/database/prismaClient'
import { DashboardRepository } from '@/interfaces/dashboard/dashboard-repository.interface'

export class PrismaDashboardRepository implements DashboardRepository {
  async getTotalForEachCategory(userId: string): Promise<any> {
    const transactions = await prismaClient.transaction.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
    })

    const groupedData = transactions.reduce((acc, transaction) => {
      const category = transaction.category.title
      const amount = transaction.amount

      if (acc[category]) {
        acc[category] += amount
      } else {
        acc[category] = amount
      }

      return acc
    }, {})

    return Object.entries(groupedData).map(([title, amount]) => ({
      title,
      amount,
    }))
  }

  async getGeneralDataOfUser(userId: string): Promise<any> {
    const userData = await prismaClient.user.findFirst({
      where: {
        id: userId,
      },
    })

    const monthlyIncome = userData?.monthlyIncome

    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const monthlyTransactions = await prismaClient.transaction.findMany({
      where: {
        userId,
        insertedAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    })

    const totalExpensesForMonth = monthlyTransactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0,
    )

    const fixedExpenses = await prismaClient.transaction.findMany({
      where: {
        userId,
        isFixed: true,
      },
    })

    const totalFixedExpenses = fixedExpenses.reduce(
      (acc, transaction) => acc + transaction.amount,
      0,
    )

    const creditCardExpenses = await prismaClient.transaction.findMany({
      where: {
        userId,
        transactionType: 'credit',
        dueDate: {
          gte: now,
        },
      },
    })

    const totalCreditCardExpenses = creditCardExpenses.reduce(
      (acc, transaction) => acc + transaction.amount,
      0,
    )

    const totalExpensesForComingMonths =
      totalFixedExpenses + totalCreditCardExpenses

    const generalData = {
      monthlyIncome,
      totalExpensesForMonth,
      totalExpensesForComingMonths,
    }

    return generalData
  }
}
