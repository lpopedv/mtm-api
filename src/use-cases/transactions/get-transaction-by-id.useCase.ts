import { prisma } from "~/database/prisma-client"
import { TransactionNotExistsError } from "~/errors/transaction/transaction-not-exists.error"
import { UserNotExistsError } from "~/errors/users/user-not-exists.error"

const execute = async (userId: number, transactionId: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  if (user === null) throw new UserNotExistsError(userId)

  const transaction = await prisma.transaction.findUnique({
    where: {
      id: transactionId,
      user_id: userId
    },
    include: {
      installments: true
    }
  })

  if (transaction === null) throw new TransactionNotExistsError(transactionId)

  return transaction
}

export const GetTransactionById = {
  execute
}
