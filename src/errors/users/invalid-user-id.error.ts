export class InvalidUserIdError extends Error {
  constructor() {
    super("O ID de usuário é inválido")
  }
}
