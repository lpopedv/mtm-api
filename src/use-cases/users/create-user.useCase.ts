import { UserAlreadyExistsError } from '@/errors/user-already-exists-error'
import { UserRepository } from '@/interfaces/users/user-repository.interface'
import { Prisma } from '@prisma/client'

import { hash } from 'bcrypt'

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    fullName,
    email,
    monthlyIncome,
    password,
  }: Prisma.UserUncheckedCreateInput): Promise<Prisma.UserUncheckedCreateInput> {
    const passwordHash = await hash(password, 10)

    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const newUser = await this.userRepository.create({
      fullName,
      email,
      monthlyIncome,
      password: passwordHash,
    })

    return newUser
  }
}
