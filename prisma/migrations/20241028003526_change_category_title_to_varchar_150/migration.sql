/*
  Warnings:

  - You are about to alter the column `title` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "title" SET DATA TYPE VARCHAR(150);
