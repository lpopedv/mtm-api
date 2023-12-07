/*
  Warnings:

  - Added the required column `movementType` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('income', 'outgoing');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "movementType" "MovementType" NOT NULL;
