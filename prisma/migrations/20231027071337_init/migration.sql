/*
  Warnings:

  - Added the required column `updatedAt` to the `td_piu_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `td_piu_user` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `PiuProfile` (
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

-- CreateTable
CREATE TABLE `td_song` (
    `seq` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `artist` VARCHAR(191) NOT NULL,
    `bpm` DOUBLE NOT NULL,
    `version` ENUM('FIRST_ZERO', 'NX_NXA', 'FIESTA_FIESTA2', 'PRIME', 'PRIME2', 'XX', 'PHOENIX') NOT NULL,
    `song_type` ENUM('ARCADE', 'REMIX', 'FULL_SONG', 'SHORT_CUT') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `td_chart` (
    `seq` INTEGER NOT NULL AUTO_INCREMENT,
    `song_seqe` INTEGER NOT NULL,
    `chart_type` ENUM('SINGLE', 'DOUBLE', 'CO_OP', 'UCS') NOT NULL,
    `level` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `td_record` (
    `seq` INTEGER NOT NULL AUTO_INCREMENT,
    `song_seq` INTEGER NOT NULL,
    `chart_seq` INTEGER NOT NULL,
    `user_seq` INTEGER NOT NULL,
    `piu_user_seq` INTEGER NOT NULL,
    `piu_profile_seq` INTEGER NOT NULL,
    `score` INTEGER NOT NULL,
    `perfect` INTEGER NOT NULL,
    `great` INTEGER NOT NULL,
    `good` INTEGER NOT NULL,
    `bad` INTEGER NOT NULL,
    `miss` INTEGER NOT NULL,
    `max_combo` INTEGER NOT NULL,
    `grade` ENUM('ROUGH_GAME', 'FAIR_GAME', 'TALENTED_GAME', 'MARVELOUS_GAME', 'SUPERB_GAME', 'EXTREME_GAME', 'ULTIMATE_GAME', 'PERFECT_GAME') NOT NULL,
    `plate` ENUM('SSS_PLUS', 'SSS', 'SS_PLUS', 'SS', 'S_PLUS', 'S', 'AAA_PLUS', 'AAA', 'AA_PLUS', 'AA', 'A_PLUS', 'A', 'B', 'C', 'D', 'F') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `td_chart` ADD CONSTRAINT `td_chart_song_seqe_fkey` FOREIGN KEY (`song_seqe`) REFERENCES `td_song`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `td_record` ADD CONSTRAINT `td_record_song_seq_fkey` FOREIGN KEY (`song_seq`) REFERENCES `td_song`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `td_record` ADD CONSTRAINT `td_record_chart_seq_fkey` FOREIGN KEY (`chart_seq`) REFERENCES `td_chart`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `td_record` ADD CONSTRAINT `td_record_user_seq_fkey` FOREIGN KEY (`user_seq`) REFERENCES `td_user`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `td_record` ADD CONSTRAINT `td_record_piu_user_seq_fkey` FOREIGN KEY (`piu_user_seq`) REFERENCES `td_piu_user`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `td_record` ADD CONSTRAINT `td_record_piu_profile_seq_fkey` FOREIGN KEY (`piu_profile_seq`) REFERENCES `PiuProfile`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;
