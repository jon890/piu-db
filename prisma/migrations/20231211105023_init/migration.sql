/*
  Warnings:

  - You are about to drop the column `piu_user_seq` on the `td_record` table. All the data in the column will be lost.
  - You are about to drop the `td_piu_user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userSeq` to the `td_piu_profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "td_piu_user" DROP CONSTRAINT "td_piu_user_user_seq_fkey";

-- DropForeignKey
ALTER TABLE "td_record" DROP CONSTRAINT "td_record_piu_user_seq_fkey";

-- AlterTable
ALTER TABLE "td_piu_profile" ADD COLUMN     "userSeq" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "td_record" DROP COLUMN "piu_user_seq";

-- DropTable
DROP TABLE "td_piu_user";

-- AddForeignKey
ALTER TABLE "td_piu_profile" ADD CONSTRAINT "td_piu_profile_userSeq_fkey" FOREIGN KEY ("userSeq") REFERENCES "td_user"("seq") ON DELETE RESTRICT ON UPDATE CASCADE;
