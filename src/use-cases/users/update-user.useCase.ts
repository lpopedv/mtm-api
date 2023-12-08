import { User } from '@/@types/user'
import { UserNotFoundError } from '@/errors/user-not-found-error'
import { UserRepository } from '@/interfaces/users/user-repository.interface'

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, data: User) {
    const updatedUser = await this.userRepository.update(id, data)

    if (updatedUser === null) throw new UserNotFoundError()

    return updatedUser
  }
}
