export class InvalidEmailOrPassword extends Error {
  constructor() {
    super("E-mail ou senha inválidos")
  }
}
