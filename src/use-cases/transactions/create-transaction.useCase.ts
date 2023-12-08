import { CategoryNotFoundError } from '@/errors/categories/category-not-found-error'
import { UserNotFoundError } from '@/errors/user-not-found-error'
import { CategoryRepository } from '@/interfaces/categories/category-repository.interface'
import { TransactionsRepository } from '@/interfaces/transactions/transaction-repository.interface'
import { UserRepository } from '@/interfaces/users/user-repository.interface'
import { Prisma } from '@prisma/client'

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly usersRepository: UserRepository,
    private readonly categoriesRepository: CategoryRepository,
  ) {}

  async execute({
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
  }: Prisma.TransactionUncheckedCreateInput) {
    const user = await this.usersRepository.findById(userId)

    if (user === null) {
      throw new UserNotFoundError()
    }

    const category = await this.categoriesRepository.findById(
      categoryId,
      userId,
    )

    if (dueDate === '') {
      dueDate = null
    }

    if (category === null) {
      throw new CategoryNotFoundError()
    }

    const newTransaction = await this.transactionsRepository.create(
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

    return newTransaction
  }
}
