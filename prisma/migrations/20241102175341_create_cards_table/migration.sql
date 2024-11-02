-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "card_id" INTEGER;

-- CreateTable
CREATE TABLE "cards" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "limit" DOUBLE PRECISION NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "bestDayToBuy" INTEGER NOT NULL,
    "insertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
