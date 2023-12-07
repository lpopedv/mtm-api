import { CategoryNotFoundError } from '@/errors/category-not-found-error'
import { TransactionNotFoundError } from '@/errors/transaction-not-found-error'
import { UserNotFoundError } from '@/errors/user-not-found-error'
import { CategoryRepository } from '@/interfaces/categories/category-repository.interface'
import { TransactionsRepository } from '@/interfaces/transactions/transaction-repository.interface'
import { UserRepository } from '@/interfaces/users/user-repository.interface'
import { Prisma } from '@prisma/client'

export class UpdateTransactionUseCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly usersRepository: UserRepository,
    private readonly categoriesRepository: CategoryRepository,
  ) {}

  async execute(
    id: string,
    {
      userId,
      categoryId,
      title,
      transactionType,
      movementType,
      amount,
      description,
      isFixed,
      installments,
      currentInstallment,
      dueDate,
    }: Prisma.TransactionUncheckedCreateInput,
  ) {
    const transaction = await this.transactionsRepository.findById(id, userId)

    if (transaction === null) {
      throw new TransactionNotFoundError()
    }

    const user = await this.usersRepository.findById(userId)

    if (user === null) {
      throw new UserNotFoundError()
    }

    const category = await this.categoriesRepository.findById(
      categoryId,
      userId,
    )

    if (category === null) {
      throw new CategoryNotFoundError()
    }

    const updatedTransaction = await this.transactionsRepository.update(
      id,
      {
        userId,
        categoryId,
        title,
        transactionType,
        movementType,
        amount,
        description,
        isFixed,
        installments,
        currentInstallment,
        dueDate,
      },
      userId,
    )

    return updatedTransaction
  }
}
