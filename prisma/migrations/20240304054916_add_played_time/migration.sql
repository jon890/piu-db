/*
  Warnings:

  - Added the required column `playedAt` to the `td_record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "td_record" ADD COLUMN     "playedAt" TIMESTAMP(3) NOT NULL;
