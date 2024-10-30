const bcryptHash = async (
  plainTextPassword: string,
  cost: number = 10,
): Promise<string> =>
  await Bun.password.hash(plainTextPassword, {
    algorithm: 'bcrypt',
    cost,
  })

const checkHash = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => await Bun.password.verify(password, passwordHash)

export const CryptographyUtils = {
  bcryptHash,
  checkHash,
}

