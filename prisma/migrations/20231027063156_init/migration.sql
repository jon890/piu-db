-- CreateTable
CREATE TABLE `td_user` (
    `seq` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `piu_user_seq` INTEGER NOT NULL,

    UNIQUE INDEX `td_user_name_key`(`name`),
    PRIMARY KEY (`seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `td_piu_user` (
    `seq` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `td_piu_user_email_key`(`email`),
    PRIMARY KEY (`seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `td_user` ADD CONSTRAINT `td_user_piu_user_seq_fkey` FOREIGN KEY (`piu_user_seq`) REFERENCES `td_piu_user`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;
