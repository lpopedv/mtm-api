import { prisma } from "~/database/prisma-client";
import type { User } from "~/dto";
import { EmailAlreadyExistsError } from "~/errors/users/email-already-exists.error";
import { CryptographyUtils } from "~/utils/cryptography";

const execute = async (user: User) => {
  const emailExists = await prisma.user.findUnique({
    where: {
      email: user.email
    }
  })

  if (emailExists !== null) throw new EmailAlreadyExistsError(user.email)

  const passwordHash = await CryptographyUtils.bcryptHash(user.password)

  await prisma.user.create({
    data: {
      email: user.email,
      full_name: user.fullName,
      password_hash: passwordHash,
      super_user: user.superUser
    }
  })
}

export const CreateUserUseCase = {
  execute
}
