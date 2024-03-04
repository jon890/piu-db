/*
  Warnings:

  - The values [ROUGH_GAME,FAIR_GAME,TALENTED_GAME,MARVELOUS_GAME,SUPERB_GAME,EXTREME_GAME,ULTIMATE_GAME,PERFECT_GAME] on the enum `RecordGrade` will be removed. If these variants are still used in the database, this will fail.
  - The values [SSS_PLUS,SSS,SS_PLUS,SS,S_PLUS,S,AAA_PLUS,AAA,AA_PLUS,AA,A_PLUS,A,B,C,D,F] on the enum `RecordPlate` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RecordGrade_new" AS ENUM ('SSS_PLUS', 'SSS', 'SS_PLUS', 'SS', 'S_PLUS', 'S', 'AAA_PLUS', 'AAA', 'AA_PLUS', 'AA', 'A_PLUS', 'A', 'B', 'C', 'D', 'F');
ALTER TABLE "td_record" ALTER COLUMN "grade" TYPE "RecordGrade_new" USING ("grade"::text::"RecordGrade_new");
ALTER TYPE "RecordGrade" RENAME TO "RecordGrade_old";
ALTER TYPE "RecordGrade_new" RENAME TO "RecordGrade";
DROP TYPE "RecordGrade_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RecordPlate_new" AS ENUM ('ROUGH_GAME', 'FAIR_GAME', 'TALENTED_GAME', 'MARVELOUS_GAME', 'SUPERB_GAME', 'EXTREME_GAME', 'ULTIMATE_GAME', 'PERFECT_GAME');
ALTER TABLE "td_record" ALTER COLUMN "plate" TYPE "RecordPlate_new" USING ("plate"::text::"RecordPlate_new");
ALTER TYPE "RecordPlate" RENAME TO "RecordPlate_old";
ALTER TYPE "RecordPlate_new" RENAME TO "RecordPlate";
DROP TYPE "RecordPlate_old";
COMMIT;
