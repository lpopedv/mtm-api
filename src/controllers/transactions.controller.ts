import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { CreateTransactionUseCase } from '@/use-cases/transactions/create-transaction.useCase'
import { FindManyTransactionUseCase } from '@/use-cases/transactions/find-many-transaction.useCase'
import { FindTransactionByIdUseCase } from '@/use-cases/transactions/find-transaction-by-id.useCase'
import { UpdateTransactionUseCase } from '@/use-cases/transactions/update-transaction.useCase'

import { CategoryNotFoundError } from '@/errors/categories/category-not-found-error'
import { UserNotFoundError } from '@/errors/user-not-found-error'

import { PrismaCategoryRepository } from '@/repositories/prisma/PrismaCategoryRepository'
import { PrismaTransactionRepository } from '@/repositories/prisma/PrismaTransactionRepository'
import { PrismaUserRepository } from '@/repositories/prisma/PrismaUserRepository'
import { TransactionNotFoundError } from '@/errors/transaction-not-found-error'

export class TransactionsController {
  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.sub

      const transactionsRepository = new PrismaTransactionRepository()

      const findManyUseCase = new FindManyTransactionUseCase(
        transactionsRepository,
        userId,
      )

      const transactions = await findManyUseCase.execute()

      return reply.status(200).send(transactions)
    } catch (error) {
      return reply.status(500).send()
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.sub

      const findByIdParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = findByIdParamsSchema.parse(request.params)

      const transactionsRepository = new PrismaTransactionRepository()

      const findTransactionByIdUseCase = new FindTransactionByIdUseCase(
        transactionsRepository,
        userId,
      )

      const transaction = await findTransactionByIdUseCase.execute(id)

      return reply.status(200).send(transaction)
    } catch (error) {
      if (error instanceof TransactionNotFoundError)
        return reply.status(404).send(error.message)
      return reply.status(500).send()
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
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

      const transactionsRepository = new PrismaTransactionRepository()
      const usersRepository = new PrismaUserRepository()
      const categoriesRepository = new PrismaCategoryRepository()

      const createTransactionUseCase = new CreateTransactionUseCase(
        transactionsRepository,
        usersRepository,
        categoriesRepository,
      )

      const newTransaction = await createTransactionUseCase.execute({
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

      return reply.status(200).send(newTransaction)
    } catch (error) {
      if (error instanceof CategoryNotFoundError) {
        return reply.status(404).send(error.message)
      }

      if (error instanceof UserNotFoundError) {
        return reply.status(404).send(error.message)
      }

      return reply.status(500).send()
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.sub

      const updateParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = updateParamsSchema.parse(request.params)

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

      const transactionsRepository = new PrismaTransactionRepository()
      const usersRepository = new PrismaUserRepository()
      const categoriesRepository = new PrismaCategoryRepository()

      const updateTransactionUseCase = new UpdateTransactionUseCase(
        transactionsRepository,
        usersRepository,
        categoriesRepository,
      )

      const transaction = await updateTransactionUseCase.execute(id, {
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

      return reply.status(200).send(transaction)
    } catch (error) {
      if (error instanceof TransactionNotFoundError) {
        return reply.status(404).send(error.message)
      }

      if (error instanceof CategoryNotFoundError) {
        return reply.status(404).send(error.message)
      }

      if (error instanceof UserNotFoundError) {
        return reply.status(404).send(error.message)
      }

      return reply.status(500).send()
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.sub

      const deleteParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = deleteParamsSchema.parse(request.params)

      const transactionsRepository = new PrismaTransactionRepository()

      const transaction = await transactionsRepository.delete(id, userId)

      return reply.send(transaction)
    } catch (error) {
      if (error instanceof TransactionNotFoundError)
        return reply.status(404).send(error.message)

      return reply.status(500).send()
    }
  }
}
