/*
  Warnings:

  - A unique constraint covering the columns `[verification_token]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `profiles` ADD COLUMN `email_verified` DATETIME(3) NULL,
    ADD COLUMN `token_expiry` DATETIME(3) NULL,
    ADD COLUMN `verification_token` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `profiles_verification_token_key` ON `profiles`(`verification_token`);
