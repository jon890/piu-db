/*
  Warnings:

  - You are about to drop the column `userSeq` on the `td_piu_profile` table. All the data in the column will be lost.
  - Added the required column `user_seq` to the `td_piu_profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "td_piu_profile" DROP CONSTRAINT "td_piu_profile_userSeq_fkey";

-- AlterTable
ALTER TABLE "td_piu_profile" DROP COLUMN "userSeq",
ADD COLUMN     "user_seq" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "td_piu_profile" ADD CONSTRAINT "td_piu_profile_user_seq_fkey" FOREIGN KEY ("user_seq") REFERENCES "td_user"("seq") ON DELETE RESTRICT ON UPDATE CASCADE;
