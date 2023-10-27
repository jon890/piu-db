/*
  Warnings:

  - You are about to drop the column `createdAt` on the `td_chart` table. All the data in the column will be lost.
  - You are about to drop the column `song_seqe` on the `td_chart` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `td_chart` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `td_piu_profile` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `td_piu_profile` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `td_piu_user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `td_piu_user` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `td_record` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `td_record` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `td_song` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `td_song` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `td_user` table. All the data in the column will be lost.
  - You are about to drop the column `piu_user_seq` on the `td_user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `td_user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_seq]` on the table `td_piu_user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `song_seq` to the `td_chart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `td_chart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `td_piu_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `td_piu_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_seq` to the `td_piu_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `td_record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `td_song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `td_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `td_chart` DROP FOREIGN KEY `td_chart_song_seqe_fkey`;

-- DropForeignKey
ALTER TABLE `td_user` DROP FOREIGN KEY `td_user_piu_user_seq_fkey`;

-- AlterTable
ALTER TABLE `td_chart` DROP COLUMN `createdAt`,
    DROP COLUMN `song_seqe`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `song_seq` INTEGER NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `td_piu_profile` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `td_piu_user` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `user_seq` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `td_record` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `td_song` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `td_user` DROP COLUMN `createdAt`,
    DROP COLUMN `piu_user_seq`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `td_piu_user_user_seq_key` ON `td_piu_user`(`user_seq`);

-- AddForeignKey
ALTER TABLE `td_piu_user` ADD CONSTRAINT `td_piu_user_user_seq_fkey` FOREIGN KEY (`user_seq`) REFERENCES `td_user`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `td_chart` ADD CONSTRAINT `td_chart_song_seq_fkey` FOREIGN KEY (`song_seq`) REFERENCES `td_song`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;
