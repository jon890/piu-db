/*
  Warnings:

  - You are about to drop the column `songSeq` on the `td_record` table. All the data in the column will be lost.
  - You are about to drop the column `userSeq` on the `td_record` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "td_record" DROP CONSTRAINT "td_record_songSeq_fkey";

-- DropForeignKey
ALTER TABLE "td_record" DROP CONSTRAINT "td_record_userSeq_fkey";

-- AlterTable
ALTER TABLE "td_record" DROP COLUMN "songSeq",
DROP COLUMN "userSeq";
