import { prisma } from "~/database/prisma-client"
import { InvalidEmailOrPassword } from "~/errors/authentication/invalid-email-or-password.error"
import { CryptographyUtils } from "~/utils/cryptography"
import jwt from 'jsonwebtoken'
import { env } from "~/env"

type AuthenticatePayload = {
  email: string
  password: string
}

export type TokenPayload = {
  sub: number
  fullName: string
  email: string
  superUser: boolean
}

const execute = async ({ email, password }: AuthenticatePayload) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (user === null) throw new InvalidEmailOrPassword()

  const passwordIsValid = await CryptographyUtils.checkHash(password, user.password_hash)

  if (passwordIsValid === false) throw new InvalidEmailOrPassword()

  const jwtToken = jwt.sign(
    {
      sub: user.id,
      fullName: user.full_name,
      email: user.email,
      superUser: user.super_user
    },
    env.JWT_SECRET_KEY,
    {
      expiresIn: '1d'
    }
  )

  return jwtToken
}

export const SessionsUseCase = {
  execute
}
