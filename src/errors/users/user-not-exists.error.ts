export class UserNotExistsError extends Error {
  constructor(userId: number) {
    super(`O usuário de id ${userId} não existe`)
  }
}
