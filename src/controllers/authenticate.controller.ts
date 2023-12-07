import { InvalidCredentialsError } from '@/errors/invalid-credentials.error'
import { PrismaUserRepository } from '@/repositories/prisma/PrismaUserRepository'
import { AuthenticateUseCase } from '@/use-cases/authentication/authenticate'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export class AuthenticateController {
  async authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })

    try {
      const { email, password } = authenticateBodySchema.parse(request.body)

      const repository = new PrismaUserRepository()
      const useCase = new AuthenticateUseCase(repository)

      const user = await useCase.execute({ email, password })

      const token = await reply.jwtSign(
        {},
        {
          sign: {
            sub: user.id,
          },
        },
      )

      return reply.status(200).send({
        ...user,
        accessToken: token,
      })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.status(401).send({ message: error.message })
      }

      console.log(error)
      return reply.status(500).send({ message: 'Internal server error' })
    }
  }
}
