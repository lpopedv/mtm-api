import { TransactionsRepository } from '@/interfaces/transactions/transaction-repository.interface'

export class FindManyTransactionUseCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private userId: string,
  ) {}

  async execute() {
    const transactions = await this.transactionsRepository.findMany(this.userId)
    return transactions
  }
}
