/*
  Warnings:

  - You are about to drop the column `endDate` on the `td_assignment` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `td_assignment` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `td_assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `td_assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `td_assignment` DROP COLUMN `endDate`,
    DROP COLUMN `startDate`,
    ADD COLUMN `end_date` DATETIME(3) NOT NULL,
    ADD COLUMN `start_date` DATETIME(3) NOT NULL;
