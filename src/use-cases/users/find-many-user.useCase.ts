import { UserRepository } from '@/interfaces/users/user-repository.interface'

export class FindManyUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute() {
    const allUsers = await this.userRepository.findMany()
    return allUsers
  }
}
