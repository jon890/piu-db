/*
  Warnings:

  - You are about to drop the `PiuProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `td_record` DROP FOREIGN KEY `td_record_piu_profile_seq_fkey`;

-- DropTable
DROP TABLE `PiuProfile`;

-- CreateTable
CREATE TABLE `td_piu_profile` (
    `seq` INTEGER NOT NULL AUTO_INCREMENT,
    `nickname` VARCHAR(191) NOT NULL,
    `hash_code` VARCHAR(191) NOT NULL,
    `last_login_date` VARCHAR(191) NOT NULL,
    `last_played_center` VARCHAR(191) NOT NULL,
    `pp` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `td_record` ADD CONSTRAINT `td_record_piu_profile_seq_fkey` FOREIGN KEY (`piu_profile_seq`) REFERENCES `td_piu_profile`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;
