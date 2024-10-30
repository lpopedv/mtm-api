export class CategoryNotExistsError extends Error {
  constructor(categoryId: string) {
    super(`A categoria de ID ${categoryId} não existe`)
  }
}
