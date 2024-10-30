import type Elysia from "elysia";
import { t } from "elysia";
import type { User } from "~/dto";
import { EmailAlreadyExistsError } from "~/errors/users/email-already-exists.error";
import { CreateUserUseCase } from "~/use-cases/users/create-user.useCase";

export const userHttpHandlers = (app: Elysia) => {
  app.post(
    '/users',
    async ({ body, set }) => {
      try {
        set.status = 201

        const newUser: User = {
          fullName: body.full_name,
          email: body.email,
          password: body.password,
          superUser: body.super_user
        }

        await CreateUserUseCase.execute(newUser)
      } catch (error) {
        if (error instanceof EmailAlreadyExistsError) {
          set.status = 409 // Conflict

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
        full_name: t.String({
          minLength: 5,
          maxLength: 150
        }),
        email: t.String({
          format: 'email'
        }),
        password: t.String({
          minLength: 8
        }),
        super_user: t.Boolean(),
      })
    }
  )

  return app
}
