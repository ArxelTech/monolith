/*
  Warnings:

  - The `transactionId` column on the `TicketPurchase` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TicketPurchase" DROP COLUMN "transactionId",
ADD COLUMN     "transactionId" INTEGER;
