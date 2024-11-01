export class TransactionNotExistsError extends Error {
  constructor(transactionId: number) {
    super(`A transação de id ${transactionId} não existe`)
  }
}
