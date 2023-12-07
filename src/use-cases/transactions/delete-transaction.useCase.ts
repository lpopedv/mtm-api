import { TransactionNotFoundError } from '@/errors/transaction-not-found-error'
import { TransactionsRepository } from '@/interfaces/transactions/transaction-repository.interface'

export class DeleteTransactionUseCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async execute(id: string) {
    const transaction = await this.transactionsRepository.findById(id)

    if (transaction === null) {
      throw new TransactionNotFoundError()
    }

    const deletedTransaction = await this.transactionsRepository.delete(id)
    return deletedTransaction
  }
}
