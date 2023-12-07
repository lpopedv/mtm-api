import { AuthenticateController } from '@/controllers/authenticate.controller'
import { CategoryController } from '@/controllers/categories.controller'
import { DashboardController } from '@/controllers/dashboard.controller'
import { TransactionsController } from '@/controllers/transactions.controller'
import { UserController } from '@/controllers/users.controller'
import { FastifyInstance } from 'fastify'

const usersController = new UserController()
const categoriesController = new CategoryController()
const transactionsController = new TransactionsController()
const authenticateController = new AuthenticateController()
const dashboardController = new DashboardController()

export async function appRoutes(app: FastifyInstance) {
  app.post('/login', authenticateController.authenticate)

  app.get('/users', usersController.findMany)
  app.get('/users/:id', usersController.findById)
  app.post('/users', usersController.create)
  app.patch('/users/:id', usersController.update)
  app.delete('/users/:id', usersController.delete)

  app.get('/categories', categoriesController.findMany)
  app.get('/categories/:id', categoriesController.findById)
  app.post('/categories', categoriesController.create)
  app.patch('/categories/:id', categoriesController.update)
  app.delete('/categories/:id', categoriesController.delete)

  app.get('/transactions', transactionsController.findMany)
  app.get('/transactions/:id', transactionsController.findById)
  app.post('/transactions', transactionsController.create)
  app.patch('/transactions/:id', transactionsController.update)
  app.delete('/transactions/:id', transactionsController.delete)

  app.get('/getDashboardData', dashboardController.getDashboardData)
}
