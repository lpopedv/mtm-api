import { prisma } from "~/database/prisma-client"
import { UserNotExistsError } from "~/errors/users/user-not-exists.error"

export const execute = async (userId: number) => {

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  if (user === null) throw new UserNotExistsError(userId)

  const transactions = await prisma.transaction.findMany({
    where: { user_id: userId },
    include: {
      category: {
        select: {
          title: true
        }
      }
    }
  })

  const userTransactions = transactions.map((transaction) => ({
    title: transaction.title,
    category: transaction.category.title,
    type: transaction.type,
    value: transaction.value,
    date: transaction.date,
    is_recurring: transaction.is_recurring,
    installment_count: transaction.installment_count,
  }))

  return userTransactions
}

export const ListTransactionsUseCase = {
  execute
}
