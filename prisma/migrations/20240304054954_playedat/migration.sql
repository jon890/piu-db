/*
  Warnings:

  - You are about to drop the column `playedAt` on the `td_record` table. All the data in the column will be lost.
  - Added the required column `played_at` to the `td_record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "td_record" DROP COLUMN "playedAt",
ADD COLUMN     "played_at" TIMESTAMP(3) NOT NULL;
