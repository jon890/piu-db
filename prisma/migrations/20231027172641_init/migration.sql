-- CreateTable
CREATE TABLE `td_assignment_room` (
    `seq` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_user_seq` INTEGER NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `td_assignment_room_participants` (
    `seq` INTEGER NOT NULL AUTO_INCREMENT,
    `room_seq` INTEGER NOT NULL,
    `user_seq` INTEGER NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `td_assignment_room_participants_room_seq_user_seq_key`(`room_seq`, `user_seq`),
    PRIMARY KEY (`seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `td_assignment` (
    `seq` INTEGER NOT NULL AUTO_INCREMENT,
    `room_seq` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `chart_seq` INTEGER NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `td_assignment_record` (
    `seq` INTEGER NOT NULL AUTO_INCREMENT,
    `assignment_seq` INTEGER NOT NULL,
    `user_seq` INTEGER NOT NULL,
    `record_seq` INTEGER NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`seq`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `td_assignment_room` ADD CONSTRAINT `td_assignment_room_admin_user_seq_fkey` FOREIGN KEY (`admin_user_seq`) REFERENCES `td_user`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `td_assignment_room_participants` ADD CONSTRAINT `td_assignment_room_participants_room_seq_fkey` FOREIGN KEY (`room_seq`) REFERENCES `td_assignment_room`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `td_assignment_room_participants` ADD CONSTRAINT `td_assignment_room_participants_user_seq_fkey` FOREIGN KEY (`user_seq`) REFERENCES `td_user`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `td_assignment` ADD CONSTRAINT `td_assignment_room_seq_fkey` FOREIGN KEY (`room_seq`) REFERENCES `td_assignment_room`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `td_assignment` ADD CONSTRAINT `td_assignment_chart_seq_fkey` FOREIGN KEY (`chart_seq`) REFERENCES `td_chart`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `td_assignment_record` ADD CONSTRAINT `td_assignment_record_assignment_seq_fkey` FOREIGN KEY (`assignment_seq`) REFERENCES `td_assignment`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `td_assignment_record` ADD CONSTRAINT `td_assignment_record_user_seq_fkey` FOREIGN KEY (`user_seq`) REFERENCES `td_user`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `td_assignment_record` ADD CONSTRAINT `td_assignment_record_record_seq_fkey` FOREIGN KEY (`record_seq`) REFERENCES `td_record`(`seq`) ON DELETE RESTRICT ON UPDATE CASCADE;
