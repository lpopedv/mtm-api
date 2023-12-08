import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { appRoutes } from './routes'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'

export const app = fastify()

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError)
    return reply
      .status(400)
      .send({ message: 'Validation error', issures: error.format() })

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: external log tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send()
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(cors, {
  origin: '*',
  methods: 'GET,PUT,POST,DELETE,PATCH',
  credentials: true,
  optionsSuccessStatus: 204,
})

app.register(appRoutes)
