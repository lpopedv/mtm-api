import { prisma } from "~/database/prisma-client"
import type { Card } from "~/dto/card.dto"

export const execute = async (card: Card) => {
  await prisma.card.create({
    data: {
      user_id: card.userId,
      title: card.title,
      limit: card.limit,
      expirationDate: card.expirationDate,
      bestDayToBuy: card.bestDayToBuy,

    }
  })
}

export const CreateCardUseCase = {
  execute
}
