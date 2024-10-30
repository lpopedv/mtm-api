export type Installment = {
  id?: number
  transaction_id?: number
  number: number
  due_date?: string
  value: number
  paid: boolean
}
