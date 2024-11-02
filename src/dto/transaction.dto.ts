import type { Installment } from "./installment.dto"

export type Transaction = {
  id?: number
  user_id: number
  category_id: number
  title: string
  type: string
  value: number
  date: string
  is_recurring: boolean
  payment_date?: string
  installment_count?: number
  installments?: Installment[]
}
