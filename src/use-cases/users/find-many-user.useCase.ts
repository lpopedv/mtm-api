import { UserRepository } from '@/interfaces/users/user-repository.interface'
import { User } from '@/types/user'

export class FindManyUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    const allUsers = await this.userRepository.findMany()
    return allUsers
  }
}
