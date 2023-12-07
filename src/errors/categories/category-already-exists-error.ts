export class CategoryAlreadyExistsError extends Error {
  constructor() {
    super('A categoria já existe')
  }
}
