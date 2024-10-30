import Elysia from "elysia";
import { userHttpHandlers } from "./handlers/user.handlers";
import { authenticationHttpHandlers } from "./handlers/authentication.handlers";
import { verify } from "jsonwebtoken";
import { env } from "~/env";
import { categoryHttpHandlers } from "./handlers/category.handlers";
import type { TokenPayload } from "~/use-cases/authentication/sessions.useCase";
import { transactionHttpHandlers } from "./handlers/transaction.handlers";

const app = new Elysia()
  .use(authenticationHttpHandlers)
  .guard(
    {
      beforeHandle: ({ headers, set }) => {
        const authToken = headers.authorization

        if (authToken === undefined) {
          set.status = 401

          return {
            success: false,
            message: 'O token de autenticação não foi informado',
          }
        }

        const [, token] = authToken.split(' ')
        try {
          const tokenData = verify(token, env.JWT_SECRET_KEY) as unknown as TokenPayload

          headers.sub = String(tokenData.sub)
          headers.fullName = tokenData.fullName
        } catch (error) {
          set.status = 401

          console.error(error)

          return {
            success: false,
            message: 'Token inválido',
          }
        }
      },
    },
    (app) => (
      app.use(categoryHttpHandlers),
      app.use(userHttpHandlers),
      app.use(transactionHttpHandlers)
    )
  )

const port = 3333

app.listen(port, () => {
  console.log(`🔥 HTTP server is running on port: http://localhost:${port}/`)
})
