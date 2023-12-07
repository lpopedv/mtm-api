import { TransactionNotFoundError } from '@/errors/transaction-not-found-error'
import { TransactionsRepository } from '@/interfaces/transactions/transaction-repository.interface'

export class FindTransactionByIdUseCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private userId: string,
  ) {}

  async execute(id: string) {
    const userId = this.userId
    const transaction = await this.transactionsRepository.findById(id, userId)

    if (transaction === null) {
      throw new TransactionNotFoundError()
    }

    return transaction
  }
}
