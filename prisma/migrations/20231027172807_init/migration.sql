/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `td_assignment_room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `td_assignment_room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `td_assignment_room` ADD COLUMN `banner_image` VARCHAR(191) NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `td_assignment_room_name_key` ON `td_assignment_room`(`name`);
