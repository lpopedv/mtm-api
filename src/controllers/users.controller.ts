import { PrismaUserRepository } from '@/repositories/prisma/PrismaUserRepository'
import { CreateUserUseCase } from '@/use-cases/users/create-user.useCase'
import { FindManyUserUseCase } from '@/use-cases/users/find-many-user.useCase'
import { FastifyReply, FastifyRequest } from 'fastify'

import { hash } from 'bcrypt'

import { z } from 'zod'
import { FindByIdUseCase } from '@/use-cases/users/find-by-id-user.useCase'
import { UpdateUserUseCase } from '@/use-cases/users/update-upser.useCase'
import { DeleteUserUseCase } from '@/use-cases/users/delete-user.useCase'

export class UserController {
  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify()

      const userRepository = new PrismaUserRepository()
      const findManyUseCase = new FindManyUserUseCase(userRepository)

      const allUsers = await findManyUseCase.execute()

      return reply.send(allUsers)
    } catch (error) {
      return reply.status(500).send(error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify()

    const findByIdSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = findByIdSchema.parse(request.params)

    try {
      const userRepository = new PrismaUserRepository()
      const findByIdUseCase = new FindByIdUseCase(userRepository)

      const user = await findByIdUseCase.execute(id)

      return reply.send(user)
    } catch (error) {
      return reply.status(500).send(error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    // await request.jwtVerify()

    const createUserSchema = z.object({
      fullName: z.string().min(3).max(255),
      email: z.string().email(),
      password: z.string().min(8).max(255),
      monthlyIncome: z.number().min(0),
    })

    const { fullName, email, password, monthlyIncome } = createUserSchema.parse(
      request.body,
    )

    try {
      const userRepository = new PrismaUserRepository()
      const createUseCase = new CreateUserUseCase(userRepository)

      const createdUser = await createUseCase.execute({
        fullName,
        email,
        password,
        monthlyIncome,
      })

      return reply.send(createdUser)
    } catch (error) {
      return reply.status(500).send(error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify()

    const uuidSchema = z.object({
      id: z.string().uuid(),
    })

    const createUserSchema = z.object({
      fullName: z.string().min(3).max(255),
      email: z.string().email(),
      password: z.string().min(8).max(255),
      monthlyIncome: z.number().min(0),
    })

    const { id } = uuidSchema.parse(request.params)

    const { fullName, email, password, monthlyIncome } = createUserSchema.parse(
      request.body,
    )

    const passwordHash = await hash(password, 10)

    try {
      const userRepository = new PrismaUserRepository()
      const updateUseCase = new UpdateUserUseCase(userRepository)

      const updatedUser = await updateUseCase.execute(id, {
        fullName,
        email,
        password: passwordHash,
        monthlyIncome,
      })

      return updatedUser
    } catch (error) {
      return reply.status(500).send(error)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify()

    const findByIdSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = findByIdSchema.parse(request.params)

    try {
      const userRepository = new PrismaUserRepository()
      const deleteUseCase = new DeleteUserUseCase(userRepository)

      const deletedUser = await deleteUseCase.execute(id)

      return reply.send(deletedUser)
    } catch (error) {
      return reply.status(500).send(error)
    }
  }
}
