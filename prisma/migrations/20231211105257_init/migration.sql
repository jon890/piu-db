/*
  Warnings:

  - You are about to drop the column `hash_code` on the `td_piu_profile` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `td_piu_profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[game_id]` on the table `td_piu_profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `game_id` to the `td_piu_profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "td_piu_profile" DROP COLUMN "hash_code",
DROP COLUMN "nickname",
ADD COLUMN     "game_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "td_piu_profile_game_id_key" ON "td_piu_profile"("game_id");
