import { AuthenticateController } from '@/http/controllers/authenticate.controller'
import { CategoryController } from '@/http/controllers/categories.controller'
import { DashboardController } from '@/http/controllers/dashboard.controller'
import { TransactionsController } from '@/http/controllers/transactions.controller'
import { UserController } from '@/http/controllers/users.controller'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'

const usersController = new UserController()
const categoriesController = new CategoryController()
const transactionsController = new TransactionsController()
const authenticateController = new AuthenticateController()
const dashboardController = new DashboardController()

export async function appRoutes(app: FastifyInstance) {
  app.post('/login', authenticateController.authenticate)

  app.get('/users', { onRequest: [verifyJWT] }, usersController.findMany)
  app.get('/users/:id', { onRequest: [verifyJWT] }, usersController.findById)
  app.post('/users', { onRequest: [verifyJWT] }, usersController.create)
  app.patch('/users/:id', { onRequest: [verifyJWT] }, usersController.update)
  app.delete('/users/:id', { onRequest: [verifyJWT] }, usersController.delete)

  app.get(
    '/categories',
    { onRequest: [verifyJWT] },
    categoriesController.findMany,
  )
  app.get(
    '/categories/:id',
    { onRequest: [verifyJWT] },
    categoriesController.findById,
  )
  app.post(
    '/categories',
    { onRequest: [verifyJWT] },
    categoriesController.create,
  )
  app.patch(
    '/categories/:id',
    { onRequest: [verifyJWT] },
    categoriesController.update,
  )
  app.delete(
    '/categories/:id',
    { onRequest: [verifyJWT] },
    categoriesController.delete,
  )

  app.get(
    '/transactions',
    { onRequest: [verifyJWT] },
    transactionsController.findMany,
  )
  app.get(
    '/transactions/:id',
    { onRequest: [verifyJWT] },
    transactionsController.findById,
  )
  app.post(
    '/transactions',
    { onRequest: [verifyJWT] },
    transactionsController.create,
  )
  app.patch(
    '/transactions/:id',
    { onRequest: [verifyJWT] },
    transactionsController.update,
  )
  app.delete(
    '/transactions/:id',
    { onRequest: [verifyJWT] },
    transactionsController.delete,
  )

  app.get(
    '/getDashboardData',
    { onRequest: [verifyJWT] },
    dashboardController.getDashboardData,
  )
}
