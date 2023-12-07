import { prismaClient } from '@/database/prismaClient'
import { TransactionsRepository } from '@/interfaces/transactions/transaction-repository.interface'
import { Prisma } from '@prisma/client'

export class PrismaTransactionRepository implements TransactionsRepository {
  async create(
    data: Prisma.TransactionUncheckedCreateInput,
    userId: string,
  ): Promise<Prisma.TransactionUncheckedCreateInput> {
    data.userId = userId
    const newTransaction = await prismaClient.transaction.create({ data })
    return newTransaction
  }

  async findMany(
    userId: string,
  ): Promise<Prisma.TransactionUncheckedCreateInput[]> {
    const allTransactions = await prismaClient.transaction.findMany({
      where: {
        userId,
      },
    })
    return allTransactions
  }

  async findById(
    id: string,
    userId: string,
  ): Promise<Prisma.TransactionUncheckedCreateInput | null> {
    const transaction = await prismaClient.transaction.findUnique({
      where: { id, userId },
    })
    return transaction
  }

  async update(
    id: string,
    data: Prisma.TransactionUncheckedCreateInput,
    userId: string,
  ): Promise<Prisma.TransactionUncheckedCreateInput> {
    data.userId = userId
    const updatedTransaction = await prismaClient.transaction.update({
      where: { id, userId },
      data,
    })
    return updatedTransaction
  }

  async delete(
    id: string,
    userId: string,
  ): Promise<Prisma.TransactionUncheckedCreateInput> {
    const deletedTransaction = await prismaClient.transaction.delete({
      where: { id, userId },
    })
    return deletedTransaction
  }
}
