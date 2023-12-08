import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { hash } from 'bcrypt'

import { CreateUserUseCase } from '@/use-cases/users/create-user.useCase'
import { FindManyUserUseCase } from '@/use-cases/users/find-many-user.useCase'
import { FindByIdUseCase } from '@/use-cases/users/find-by-id-user.useCase'
import { UpdateUserUseCase } from '@/use-cases/users/update-user.useCase'
import { DeleteUserUseCase } from '@/use-cases/users/delete-user.useCase'

import { PrismaUserRepository } from '@/repositories/prisma/PrismaUserRepository'

import { UserNotFoundError } from '@/errors/user-not-found-error'
import { UserAlreadyExistsError } from '@/errors/user-already-exists-error'

export class UserController {
  async findMany(_: FastifyRequest, reply: FastifyReply) {
    try {
      const userRepository = new PrismaUserRepository()
      const findManyUseCase = new FindManyUserUseCase(userRepository)

      const allUsers = await findManyUseCase.execute()

      return reply.send(allUsers)
    } catch (error) {
      return reply.status(500).send()
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const findByIdRequestParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = findByIdRequestParamsSchema.parse(request.params)

      const userRepository = new PrismaUserRepository()
      const findByIdUseCase = new FindByIdUseCase(userRepository)

      const user = await findByIdUseCase.execute(id)

      return reply.status(200).send(user)
    } catch (error) {
      if (error instanceof UserNotFoundError)
        return reply.status(404).send(error.message)

      return reply.status(500).send()
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const createUserBodySchema = z.object({
        fullName: z.string().min(3).max(255),
        email: z.string().email(),
        password: z.string().min(8).max(255),
        monthlyIncome: z.number().min(0),
      })

      const { fullName, email, password, monthlyIncome } =
        createUserBodySchema.parse(request.body)

      const userRepository = new PrismaUserRepository()
      const createUseCase = new CreateUserUseCase(userRepository)

      const user = await createUseCase.execute({
        fullName,
        email,
        password,
        monthlyIncome,
      })

      return reply.send({
        fullName: user.fullName,
        email: user.email,
        monthlyIncome: user.monthlyIncome,
      })
    } catch (error) {
      if (error instanceof UserAlreadyExistsError)
        return reply.status(409).send(error.message)

      return reply.status(500).send()
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const updateRequestParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = updateRequestParamsSchema.parse(request.params)

      const createUserFormSchema = z.object({
        fullName: z.string().min(3).max(255),
        email: z.string().email(),
        password: z.string().min(8).max(255),
        monthlyIncome: z.number().min(0),
      })

      const { fullName, email, password, monthlyIncome } =
        createUserFormSchema.parse(request.body)

      const passwordHash = await hash(password, 10)

      const userRepository = new PrismaUserRepository()
      const updateUserUseCase = new UpdateUserUseCase(userRepository)

      const user = await updateUserUseCase.execute(id, {
        fullName,
        email,
        password: passwordHash,
        monthlyIncome,
      })

      return reply.status(200).send({
        fullName: user.fullName,
        email: user.email,
        monthlyIncome: user.monthlyIncome,
      })
    } catch (error) {
      if (error instanceof UserNotFoundError)
        return reply.status(404).send(error.message)
      return reply.status(500).send()
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const findByIdParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = findByIdParamsSchema.parse(request.params)

    try {
      const userRepository = new PrismaUserRepository()
      const deleteUseCase = new DeleteUserUseCase(userRepository)

      const deletedUser = await deleteUseCase.execute(id)

      return reply.send({
        fullName: deletedUser.fullName,
        email: deletedUser.email,
        monthlyIncome: deletedUser.monthlyIncome,
      })
    } catch (error) {
      if (error instanceof UserNotFoundError)
        return reply.status(404).send(error.message)
      return reply.status(500).send()
    }
  }
}
