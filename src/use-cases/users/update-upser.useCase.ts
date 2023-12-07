import { UserRepository } from '@/interfaces/users/user-repository.interface'
import { User } from '@/types/user'

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, data: User): Promise<User> {
    const updatedUser = await this.userRepository.update(id, data)

    if (updatedUser === null) throw new Error('User not found')

    return updatedUser
  }
}
