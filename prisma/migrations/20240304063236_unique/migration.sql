/*
  Warnings:

  - You are about to drop the column `song_seq` on the `td_record` table. All the data in the column will be lost.
  - You are about to drop the column `user_seq` on the `td_record` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chart_seq,piu_profile_seq,played_at]` on the table `td_record` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "td_record" DROP CONSTRAINT "td_record_song_seq_fkey";

-- DropForeignKey
ALTER TABLE "td_record" DROP CONSTRAINT "td_record_user_seq_fkey";

-- AlterTable
ALTER TABLE "td_record" DROP COLUMN "song_seq",
DROP COLUMN "user_seq",
ADD COLUMN     "songSeq" INTEGER,
ADD COLUMN     "userSeq" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "td_record_chart_seq_piu_profile_seq_played_at_key" ON "td_record"("chart_seq", "piu_profile_seq", "played_at");

-- AddForeignKey
ALTER TABLE "td_record" ADD CONSTRAINT "td_record_userSeq_fkey" FOREIGN KEY ("userSeq") REFERENCES "td_user"("seq") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "td_record" ADD CONSTRAINT "td_record_songSeq_fkey" FOREIGN KEY ("songSeq") REFERENCES "td_song"("seq") ON DELETE SET NULL ON UPDATE CASCADE;
