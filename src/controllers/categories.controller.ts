import { PrismaCategoryRepository } from '@/repositories/prisma/PrismaCategoryRepository'
import { CreateCategoryUseCase } from '@/use-cases/categories/create-category.useCase'
import { DeleteCategoryUseCase } from '@/use-cases/categories/delete-category.useCase'
import { FindCategoryByIdUseCase } from '@/use-cases/categories/find-category-by-id.useCase'
import { FindManyCategoryUseCase } from '@/use-cases/categories/find-many-category.useCase'
import { UpdateCategoryUseCase } from '@/use-cases/categories/update-category.useCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export class CategoryController {
  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify()

      const userId = request.user.sub

      const userRepository = new PrismaCategoryRepository()
      const findManyUseCase = new FindManyCategoryUseCase(
        userRepository,
        userId,
      )

      const getDataToTransactionFormSchema = z.object({
        transactionForm: z.string().optional(),
      })

      const { transactionForm } = getDataToTransactionFormSchema.parse(
        request.query,
      )

      if (transactionForm === 'true') {
        const allCategories = await findManyUseCase.execute()

        const categoriesToTransactionForm = allCategories.map((category) => {
          return {
            value: category.id,
            label: category.title,
          }
        })

        return categoriesToTransactionForm
      }

      const allCategories = await findManyUseCase.execute()
      return reply.send(allCategories)
    } catch (error) {
      return reply.status(500).send(error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify()

    const userId = request.user.sub

    const findByIdSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = findByIdSchema.parse(request.params)

    try {
      const categoryRepository = new PrismaCategoryRepository()
      const findByIdUseCase = new FindCategoryByIdUseCase(categoryRepository)

      const category = await findByIdUseCase.execute(id, userId)

      return reply.send(category)
    } catch (error) {
      return reply.status(500).send(error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify()

    const userId = request.user.sub

    const createCategorySchema = z.object({
      title: z.string().min(3).max(70),
      description: z.string().min(3).max(255).optional(),
    })

    const { title, description } = createCategorySchema.parse(request.body)

    try {
      const categoryRepository = new PrismaCategoryRepository()
      const createUseCase = new CreateCategoryUseCase(categoryRepository)

      const newCategory = await createUseCase.execute({
        title,
        userId,
        description,
      })

      return reply.send(newCategory)
    } catch (error) {
      return reply.status(500).send(error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify()

    const userId = request.user.sub

    const updateCategorySchema = z.object({
      title: z.string().min(3).max(70),
      description: z.string().min(3).max(255).optional(),
    })

    const uuidSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = uuidSchema.parse(request.params)

    const { title, description } = updateCategorySchema.parse(request.body)

    try {
      const categoryRepository = new PrismaCategoryRepository()
      const updateUseCase = new UpdateCategoryUseCase(categoryRepository)

      const updatedCategory = await updateUseCase.execute(id, {
        title,
        userId,
        description,
      })

      return reply.send(updatedCategory)
    } catch (error) {
      return reply.status(500).send(error)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify()

    const userId = request.user.sub

    const uuidSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = uuidSchema.parse(request.params)

    try {
      const categoryRepository = new PrismaCategoryRepository()
      const deleteUseCase = new DeleteCategoryUseCase(
        categoryRepository,
        userId,
      )

      const deletedCategory = await deleteUseCase.execute(id)

      return reply.send(deletedCategory)
    } catch (error) {
      return reply.status(500).send(error)
    }
  }
}
