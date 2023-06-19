/*
  Warnings:

  - Added the required column `transactionId` to the `TicketPurchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketPurchase" ADD COLUMN     "transactionId" TEXT NOT NULL;
