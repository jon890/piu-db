/*
  Warnings:

  - A unique constraint covering the columns `[nickname]` on the table `td_user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `td_user_nickname_key` ON `td_user`(`nickname`);
