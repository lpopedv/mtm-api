import { prisma } from "~/database/prisma-client";
import type { Category } from "~/dto";
import { UserNotExistsError } from "~/errors/users/user-not-exists.error";

const execute = async (category: Category) => {
  const userExists = await prisma.user.findUnique({
    where: {
      id: category.user_id
    }
  })

  if (userExists === null) throw new UserNotExistsError(String(category.user_id))

  await prisma.category.create({
    data: {
      title: category.title,
      user_id: category.user_id
    }
  })
}

export const CreateCategoryUseCase = {
  execute
}
