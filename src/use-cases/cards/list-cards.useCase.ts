import { prisma } from "~/database/prisma-client"

export const execute = async (userId: number) => {
  const userCards = await prisma.card.findMany({
    where: {
      user_id: userId
    }
  })

  return userCards
}

export const ListCardsUseCase = {
  execute
}
