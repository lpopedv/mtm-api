import { UserNotFoundError } from '@/errors/user-not-found-error'
import { UserRepository } from '@/interfaces/users/user-repository.interface'

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    const userExists = await this.userRepository.findById(id)

    if (userExists === null) {
      throw new UserNotFoundError()
    }

    const deletedUser = await this.userRepository.delete(id)
    return deletedUser
  }
}
