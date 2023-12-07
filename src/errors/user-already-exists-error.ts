export class UserAlreadyExistsError extends Error {
  constructor() {
    super('O usuário já existe')
  }
}
