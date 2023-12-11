/*
  Warnings:

  - You are about to drop the column `pp` on the `td_piu_profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "td_piu_profile" DROP COLUMN "pp",
ALTER COLUMN "last_login_date" DROP NOT NULL,
ALTER COLUMN "last_played_center" DROP NOT NULL;
