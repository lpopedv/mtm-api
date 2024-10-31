import chalk from "chalk";
import { prisma } from "~/database/prisma-client";
import { CryptographyUtils } from "~/utils/cryptography";

const passwordHash = await CryptographyUtils.bcryptHash('12345678')

const userAlreadyExists = await prisma.user.findUnique({
  where: {
    email: 'admin@mtm.com.br'
  }
})

if (userAlreadyExists === null) {
  await prisma.user.create({
    data: {
      full_name: 'Administrator',
      email: 'admin@mtm.com.br',
      password_hash: passwordHash
    }
  })
}

await prisma.$disconnect()

console.log(
  chalk.greenBright(
    '🌱 The seeding process has been completed successfully!',
  )
)

process.exit()
