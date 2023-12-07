import { prismaClient } from '@/database/prismaClient'
import { UserRepository } from '@/interfaces/users/user-repository.interface'
import { Prisma } from '@prisma/client'

export class PrismaUserRepository implements UserRepository {
  async create(
    data: Prisma.UserUncheckedCreateInput,
  ): Promise<Prisma.UserUncheckedCreateInput> {
    const newUser = prismaClient.user.create({ data })
    return newUser
  }

  async findMany(): Promise<Prisma.UserUncheckedCreateInput[]> {
    const allUsers = await prismaClient.user.findMany()
    return allUsers
  }

  async findById(id: string): Promise<Prisma.UserUncheckedCreateInput | null> {
    const user = await prismaClient.user.findUnique({ where: { id } })
    return user
  }

  async findByEmail(
    email: string,
  ): Promise<Prisma.UserUncheckedCreateInput | null> {
    const user = await prismaClient.user.findUnique({
      where: { email },
      select: {
        id: true,
        fullName: true,
        email: true,
        password: true,
        monthlyIncome: true,
      },
    })

    return user
  }

  async update(
    id: string,
    data: Prisma.UserUncheckedCreateInput,
  ): Promise<Prisma.UserUncheckedCreateInput> {
    const updatedUser = await prismaClient.user.update({
      where: { id },
      data,
    })
    return updatedUser
  }

  async delete(id: string): Promise<Prisma.UserUncheckedCreateInput> {
    const deletedUser = await prismaClient.user.delete({ where: { id } })
    return deletedUser
  }
}
