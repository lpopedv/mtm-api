import { Prisma } from '@prisma/client'

export interface TransactionsRepository {
  create(
    data: Prisma.TransactionUncheckedCreateInput,
    userId: string,
  ): Promise<Prisma.TransactionUncheckedCreateInput>
  findMany(userId: string): Promise<Prisma.TransactionUncheckedCreateInput[]>
  findById(
    id: string,
    userId: string,
  ): Promise<Prisma.TransactionUncheckedCreateInput | null>
  update(
    id: string,
    data: Prisma.TransactionUncheckedCreateInput,
    userId: string,
  ): Promise<Prisma.TransactionUncheckedCreateInput>
  delete(
    id: string,
    userId: string,
  ): Promise<Prisma.TransactionUncheckedCreateInput>
}
