import type Elysia from "elysia";
import { t } from "elysia";
import type { Category } from "~/dto";
import { UserNotExistsError } from "~/errors/users/user-not-exists.error";
import { CreateCategoryUseCase } from "~/use-cases/categories/create-category.useCase";

export const categoryHttpHandlers = (app: Elysia) => {
  app.post(
    '/categories',
    async ({ body, set, headers }) => {
      try {
        set.status = 201

        const userId = headers.sub

        if (userId === undefined) throw new Error()

        const newCategory: Category = {
          title: body.title,
          user_id: Number(userId)
        }

        await CreateCategoryUseCase.execute(newCategory)

      } catch (error) {
        if (error instanceof UserNotExistsError) {
          set.status = 404 // not found

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
        title: t.String({
          minLength: 5,
          maxLength: 150
        })
      })
    }
  )

  return app
}
