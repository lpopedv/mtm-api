export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`O e-mail ${email} já existe`)
  }
}
