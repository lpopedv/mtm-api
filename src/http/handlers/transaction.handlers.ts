import type Elysia from "elysia";
import { t } from "elysia";
import type { Transaction } from "~/dto/transaction.dto";
import { CategoryNotExistsError } from "~/errors/categories/category-not-exists.error";
import { UserNotExistsError } from "~/errors/users/user-not-exists.error";
import { CreateTransactionUseCase } from "~/use-cases/transactions/create-transaction.useCase";
import { ListTransactionsUseCase } from "~/use-cases/transactions/list-transactions.useCase";

export const transactionHttpHandlers = (app: Elysia) => {
  app.post(
    '/transactions',
    async ({ body, set, headers }) => {
      try {
        set.status = 201

        const userId = headers.sub

        if (userId === undefined) throw new Error()

        const newTransaction: Transaction = {
          user_id: Number(userId),
          category_id: body.category_id,
          title: body.title,
          type: body.type,
          value: body.value,
          date: body.date,
          is_recurring: body.is_recurring,
          installments: body.installments
        }

        await CreateTransactionUseCase.execute(newTransaction)

      } catch (error) {
        if (error instanceof UserNotExistsError) {
          set.status = 404 // not found

          return {
            success: false,
            message: error.message
          }
        }

        if (error instanceof CategoryNotExistsError) {
          set.status = 404 // not found

          return {
            success: false,
            message: error.message
          }
        }

        set.status = 500 // internal server error

        console.error(error)

        return {
          success: false,
          message: 'Entre em contato com o administrador'
        }
      }
    },
    {
      body: t.Object({
        category_id: t.Number(),
        title: t.String({
          minLength: 4,
          maxLength: 150
        }),
        type: t.Union([
          t.Literal('income'),
          t.Literal('expense')
        ]),
        value: t.Number(),
        date: t.String(),
        is_recurring: t.Boolean(),
        installments: t.Optional(
          t.Array(
            t.Object({
              number: t.Number(),
              due_date: t.String(),
              value: t.Number(),
              paid: t.Boolean()
            })
          )
        )
      })
    }
  ),

    app.get('/transactions',
      async ({ set, headers }) => {
        try {
          set.status = 200

          const userId = headers.sub

          if (userId === undefined) throw new Error()

          const userTransactions = await ListTransactionsUseCase.execute(Number(userId))

          return userTransactions
        } catch (error) {
          if (error instanceof UserNotExistsError) {
            set.status = 404

            return {
              success: false,
              message: error.message
            }
          }

          set.status = 500

          return {
            success: false,
            message: 'Entre em contato com o administrador'
          }
        }
      })

  return app
}
