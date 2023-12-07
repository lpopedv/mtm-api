import { CategoryNotFoundError } from '@/errors/category-not-found-error'
import { UserNotFoundError } from '@/errors/user-not-found-error'
import { PrismaCategoryRepository } from '@/repositories/prisma/PrismaCategoryRepository'
import { PrismaTransactionRepository } from '@/repositories/prisma/PrismaTransactionRepository'
import { PrismaUserRepository } from '@/repositories/prisma/PrismaUserRepository'
import { CreateTransactionUseCase } from '@/use-cases/transactions/create-transaction.useCase'
import { FindManyTransactionUseCase } from '@/use-cases/transactions/find-many-transaction.useCase'
import { FindTransactionByIdUseCase } from '@/use-cases/transactions/find-transaction-by-id.useCase'
import { UpdateTransactionUseCase } from '@/use-cases/transactions/update-transaction.useCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export class TransactionsController {
  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify()

      const userId = request.user.sub

      const transactionsRepository = new PrismaTransactionRepository()
      const findManyUseCase = new FindManyTransactionUseCase(
        transactionsRepository,
        userId,
      )

      const transactions = await findManyUseCase.execute()

      return transactions
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
      const transactionsRepository = new PrismaTransactionRepository()
      const findByIdUseCase = new FindTransactionByIdUseCase(
        transactionsRepository,
        userId,
      )

      const transaction = await findByIdUseCase.execute(id)

      return reply.send(transaction)
    } catch (error) {
      return reply.status(500).send(error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify()

    const userId = request.user.sub

    const createTransactionSchema = z.object({
      categoryId: z.string().uuid(),
      title: z.string().min(3),
      transactionType: z.enum(['debit', 'credit']),
      movementType: z.enum(['income', 'outgoing']),
      amount: z.coerce.number(),
      description: z.string().optional(),
      isFixed: z.boolean(),
      installments: z.coerce.number().optional(),
      currentInstallment: z.coerce.number().optional(),
      dueDate: z.date().optional(),
    })

    const {
      categoryId,
      title,
      transactionType,
      movementType,
      amount,
      description,
      isFixed,
      installments,
      currentInstallment,
      dueDate,
    } = createTransactionSchema.parse(request.body)

    try {
      const transactionsRepository = new PrismaTransactionRepository()
      const usersRepository = new PrismaUserRepository()
      const categoriesRepository = new PrismaCategoryRepository()

      const createUseCase = new CreateTransactionUseCase(
        transactionsRepository,
        usersRepository,
        categoriesRepository,
      )

      const newTransaction = await createUseCase.execute({
        userId,
        categoryId,
        title,
        transactionType,
        movementType,
        amount,
        description,
        isFixed,
        installments,
        currentInstallment,
        dueDate,
      })

      return reply.send(newTransaction)
    } catch (error) {
      if (error instanceof CategoryNotFoundError) {
        return reply.status(404).send({
          error: 'Categoria não encontrada!',
        })
      }

      if (error instanceof UserNotFoundError) {
        return reply.status(404).send({
          error: 'Usuário não encontrado!',
        })
      }

      return reply.status(500).send(error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify()

    const userId = request.user.sub

    const updateTransactionSchema = z.object({
      categoryId: z.string().uuid(),
      title: z.string().min(3).max(70),
      transactionType: z.enum(['credit', 'debit']),
      movementType: z.enum(['income', 'outgoing']),
      amount: z.number().min(1),
      description: z.string().min(3).max(255).optional(),
      isFixed: z.boolean().optional(),
      installments: z.number().min(1).optional(),
      currentInstallment: z.number().min(1).optional(),
      dueDate: z.string().optional(),
    })

    const uuidSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = uuidSchema.parse(request.params)

    const {
      categoryId,
      title,
      transactionType,
      movementType,
      amount,
      description,
      isFixed,
      installments,
      currentInstallment,
      dueDate,
    } = updateTransactionSchema.parse(request.body)

    try {
      const transactionsRepository = new PrismaTransactionRepository()
      const usersRepository = new PrismaUserRepository()
      const categoriesRepository = new PrismaCategoryRepository()

      const updateUseCase = new UpdateTransactionUseCase(
        transactionsRepository,
        usersRepository,
        categoriesRepository,
      )

      const updatedTransaction = await updateUseCase.execute(id, {
        userId,
        categoryId,
        title,
        transactionType,
        movementType,
        amount,
        description,
        isFixed,
        installments,
        currentInstallment,
        dueDate,
      })

      return reply.send(updatedTransaction)
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
      const transactionsRepository = new PrismaTransactionRepository()

      const deletedTransaction = await transactionsRepository.delete(id, userId)

      return reply.send(deletedTransaction)
    } catch (error) {
      return reply.status(500).send(error)
    }
  }
}
