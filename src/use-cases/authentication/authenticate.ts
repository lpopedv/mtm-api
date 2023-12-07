import { InvalidCredentialsError } from '@/errors/invalid-credentials.error'
import { UserRepository } from '@/interfaces/users/user-repository.interface'
import { User } from '@prisma/client'
import { compare } from 'bcrypt'

type AuthenticateUseCaseRequest = {
  email: string
  password: string
}

export class AuthenticateUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, password }: AuthenticateUseCaseRequest): Promise<any> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    const { password: userPassword, ...userWithoutPassword } = user

    return userWithoutPassword
  }
}
