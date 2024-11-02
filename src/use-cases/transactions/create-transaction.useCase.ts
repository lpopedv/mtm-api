import { prisma } from "~/database/prisma-client";
import type { Transaction } from "~/dto/transaction.dto";
import { CategoryNotExistsError } from "~/errors/categories/category-not-exists.error";
import { UserNotExistsError } from "~/errors/users/user-not-exists.error";

const execute = async (transaction: Transaction) => {
  const user = await prisma.user.findUnique({
    where: {
      id: transaction.user_id
    }
  })

  if (user === null) throw new UserNotExistsError(transaction.user_id)

  const category = await prisma.category.findUnique({
    where: {
      id: transaction.category_id
    }
  })

  if (category === null) throw new CategoryNotExistsError(String(transaction.category_id))

  if (transaction.installments === undefined) {
    await prisma.transaction.create({
      data: {
        user_id: transaction.user_id,
        category_id: transaction.category_id,
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        date: new Date(transaction.date),
        payment_date: transaction.payment_date ? new Date(transaction.payment_date) : undefined,
        is_recurring: transaction.is_recurring,
        installment_count: undefined
      }
    })
  } else {
    await prisma.$transaction(async (prisma) => {
      await prisma.transaction.create({
        data: {
          user_id: transaction.user_id,
          category_id: transaction.category_id,
          title: transaction.title,
          type: transaction.type,
          value: transaction.value,
          date: new Date(transaction.date),
          is_recurring: transaction.is_recurring,
          installment_count: transaction.installments?.length,
          installments: {
            create: transaction.installments?.map((installment) => ({
              ...installment,
              due_date: installment.due_date ? new Date(installment.due_date) : null
            }))
          }
        }
      });
    })
  }
}

export const CreateTransactionUseCase = {
  execute
}
