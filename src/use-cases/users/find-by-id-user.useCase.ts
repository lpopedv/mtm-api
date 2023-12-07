import { UserNotFoundError } from '@/errors/user-not-found-error'
import { UserRepository } from '@/interfaces/users/user-repository.interface'
import { User } from '@prisma/client'

export class FindByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id)

    if (user === null) throw new UserNotFoundError()

    return user
  }
}
