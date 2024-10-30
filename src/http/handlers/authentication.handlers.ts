import type Elysia from "elysia";
import { t } from "elysia";
import { InvalidEmailOrPassword } from "~/errors/authentication/invalid-email-or-password.error";
import { SessionsUseCase } from "~/use-cases/authentication/sessions.useCase";

export const authenticationHttpHandlers = (app: Elysia) => {
  app.post(
    '/sessions',
    async ({ body, set }) => {
      try {
        set.status = 200

        const { email, password } = body

        const jwtToken = await SessionsUseCase.execute({ email, password })

        return {
          jwt_token: jwtToken
        }
      } catch (error) {
        if (error instanceof InvalidEmailOrPassword) {
          set.status = 401 // Unauthorized

          return {
            success: false,
            message: error.message
          }
        }

        set.status = 500

        console.error(error)

        return {
          success: false,
          message: 'Entre em contato com o administrador'
        }
      }
    },
    {
      body: t.Object({
        email: t.String({
          minLength: 5,
          maxLength: 150
        }),
        password: t.String({
          minLength: 8,
          maxLength: 255
        })
      })
    }
  )

  return app
}
