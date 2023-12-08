import { CategoryAlreadyExistsError } from '@/errors/categories/category-already-exists-error'
import { CategoryNotFoundError } from '@/errors/categories/category-not-found-error'
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
      const userId = request.user.sub

      const userRepository = new PrismaCategoryRepository()

      const findManyCategoryUseCase = new FindManyCategoryUseCase(
        userRepository,
        userId,
      )

      const findManyRequestParamsSchema = z.object({
        getCategoriesToTransactionSelectInput: z.string().optional(),
      })

      const { getCategoriesToTransactionSelectInput } =
        findManyRequestParamsSchema.parse(request.query)

      const allCategories = await findManyCategoryUseCase.execute()

      if (getCategoriesToTransactionSelectInput === 'true') {
        const categoriesToTransactionForm = allCategories.map((category) => {
          return {
            value: category.id,
            label: category.title,
          }
        })

        return reply.status(200).send(categoriesToTransactionForm)
      }

      return reply.status(200).send(allCategories)
    } catch (error) {
      return reply.status(500).send()
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.sub

      const findByIdRequestParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = findByIdRequestParamsSchema.parse(request.params)

      const categoryRepository = new PrismaCategoryRepository()

      const findCategoryByIdUseCase = new FindCategoryByIdUseCase(
        categoryRepository,
        userId,
      )

      const category = await findCategoryByIdUseCase.execute(id)

      return reply.status(200).send(category)
    } catch (error) {
      if (error instanceof CategoryNotFoundError)
        return reply.status(404).send(error.message)

      return reply.status(500).send()
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.sub

      const createCategoryBodySchema = z.object({
        title: z.string().min(3).max(70),
        description: z.string().min(3).max(255).optional(),
      })

      const { title, description } = createCategoryBodySchema.parse(
        request.body,
      )

      const categoryRepository = new PrismaCategoryRepository()

      const createCategoryUseCase = new CreateCategoryUseCase(
        categoryRepository,
        userId,
      )

      const category = await createCategoryUseCase.execute({
        title,
        userId,
        description,
      })

      return reply.status(200).send(category)
    } catch (error) {
      if (error instanceof CategoryAlreadyExistsError)
        return reply.status(409).send(error.message)

      return reply.status(500).send()
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.sub

      const updateCategoryParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = updateCategoryParamsSchema.parse(request.params)

      const updateCategoryBodySchema = z.object({
        title: z.string().min(3).max(70),
        description: z.string().min(3).max(255).optional(),
      })

      const { title, description } = updateCategoryBodySchema.parse(
        request.body,
      )

      const categoryRepository = new PrismaCategoryRepository()

      const updateCategoryUseCase = new UpdateCategoryUseCase(
        categoryRepository,
        userId,
      )

      const category = await updateCategoryUseCase.execute(id, {
        title,
        userId,
        description,
      })

      return reply.status(200).send(category)
    } catch (error) {
      if (error instanceof CategoryNotFoundError)
        return reply.status(404).send(error.message)

      return reply.status(500).send()
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify()

      const userId = request.user.sub

      const updateCategoryParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = updateCategoryParamsSchema.parse(request.params)

      const categoryRepository = new PrismaCategoryRepository()

      const deleteUseCase = new DeleteCategoryUseCase(
        categoryRepository,
        userId,
      )

      const deletedCategory = await deleteUseCase.execute(id)

      return reply.send(deletedCategory)
    } catch (error) {
      if (error instanceof CategoryNotFoundError)
        return reply.status(404).send(error.message)

      return reply.status(500).send()
    }
  }
}
