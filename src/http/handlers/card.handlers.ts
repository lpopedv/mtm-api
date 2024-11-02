import type Elysia from "elysia";
import { t } from "elysia";
import type { Card } from "~/dto/card.dto";
import { CreateCardUseCase } from "~/use-cases/cards/create-card.useCase";
import { ListCardsUseCase } from "~/use-cases/cards/list-cards.useCase";

export const cardHttpHandlers = (app: Elysia) => {
  app.post(
    '/card',
    async ({ body, set, headers }) => {
      try {
        set.status = 201

        const userId = headers.sub

        if (userId === undefined) throw new Error()

        const newCard: Card = {
          userId: Number(userId),
          title: body.title,
          limit: body.limit,
          bestDayToBuy: body.bestDayToBuy,
          expirationDate: new Date(body.expirationDate)
        }

        await CreateCardUseCase.execute(newCard)

      } catch (error) {
        set.status = 500

        console.error(error)

        return {
          success: false,
          message: 'Entre em contato com o administrador'
        }
      }

    },
    {
      body: t.Object({
        title: t.String({
          minLength: 5,
          maxLength: 150
        }),
        limit: t.Number(),
        expirationDate: t.String(),
        bestDayToBuy: t.Number()
      })
    }
  ),

    app.get(
      '/cards',
      async ({ set, headers }) => {
        try {
          set.status = 200 // ok

          const userId = headers.sub

          if (userId === undefined) throw new Error()

          const userCards = await ListCardsUseCase.execute(Number(userId))

          return userCards
        } catch (error) {
          set.status = 500 // internal server error

          return {
            success: false,
            message: 'Entre em contato com o administrador'
          }
        }
      }
    )

  return app
}
