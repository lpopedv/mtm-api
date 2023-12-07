import { Prisma } from '@prisma/client'

export interface UserRepository {
  create(
    data: Prisma.UserUncheckedCreateInput,
  ): Promise<Prisma.UserUncheckedCreateInput>
  findMany(): Promise<Prisma.UserUncheckedCreateInput[]>
  findById(id: string): Promise<Prisma.UserUncheckedCreateInput | null>
  findByEmail(email: string): Promise<Prisma.UserUncheckedCreateInput | null>
  update(
    id: string,
    data: Prisma.UserUncheckedCreateInput,
  ): Promise<Prisma.UserUncheckedCreateInput>
  delete(id: string): Promise<Prisma.UserUncheckedCreateInput>
}
