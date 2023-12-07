import { Prisma } from '@prisma/client'

export interface CategoryRepository {
  create(
    data: Prisma.CategoryUncheckedCreateInput,
  ): Promise<Prisma.CategoryUncheckedCreateInput>
  findMany(userId: string): Promise<Prisma.CategoryUncheckedCreateInput[]>
  findByTitle(
    title: string,
    userId: string,
  ): Promise<Prisma.CategoryUncheckedCreateInput | null>
  findById(
    id: string,
    userId: string,
  ): Promise<Prisma.CategoryUncheckedCreateInput | null>
  update(
    id: string,
    data: Prisma.CategoryUncheckedCreateInput,
    userId: string,
  ): Promise<Prisma.CategoryUncheckedCreateInput>
  delete(
    id: string,
    userId: string,
  ): Promise<Prisma.CategoryUncheckedCreateInput>
}
