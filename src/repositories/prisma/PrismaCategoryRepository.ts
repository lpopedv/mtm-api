import { prismaClient } from '@/database/prismaClient'
import { CategoryRepository } from '@/interfaces/categories/category-repository.interface'
import { Prisma } from '@prisma/client'

export class PrismaCategoryRepository implements CategoryRepository {
  async create(
    data: Prisma.CategoryUncheckedCreateInput,
  ): Promise<Prisma.CategoryUncheckedCreateInput> {
    const newUser = prismaClient.category.create({ data })
    return newUser
  }

  async findMany(
    userId: string,
  ): Promise<Prisma.CategoryUncheckedCreateInput[]> {
    const allCategories = await prismaClient.category.findMany({
      where: {
        userId,
      },
    })
    return allCategories
  }

  async findById(
    id: string,
    userId: string,
  ): Promise<Prisma.CategoryUncheckedCreateInput | null> {
    const category = await prismaClient.category.findUnique({
      where: { id, userId },
    })
    return category
  }

  async findByTitle(
    title: string,
    userId: string,
  ): Promise<Prisma.CategoryUncheckedCreateInput | null> {
    const category = await prismaClient.category.findFirst({
      where: {
        title,
        userId,
      },
    })
    return category
  }

  async update(
    id: string,
    data: Prisma.CategoryUncheckedCreateInput,
    userId: string,
  ): Promise<Prisma.CategoryUncheckedCreateInput> {
    const updatedCategory = await prismaClient.category.update({
      where: { id, userId },
      data,
    })
    return updatedCategory
  }

  async delete(
    id: string,
    userId: string,
  ): Promise<Prisma.CategoryUncheckedCreateInput> {
    const deletedCategory = await prismaClient.category.delete({
      where: { id, userId },
    })
    return deletedCategory
  }
}
