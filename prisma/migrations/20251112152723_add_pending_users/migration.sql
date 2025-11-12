/*
  Warnings:

  - The values [SUSPENDED] on the enum `profiles_verification_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `profiles` MODIFY `verification_status` ENUM('PENDING_VERIFICATION', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING_VERIFICATION';

-- CreateTable
CREATE TABLE `pending_users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `middle_initial` VARCHAR(191) NULL,
    `verification_token` VARCHAR(191) NOT NULL,
    `token_expiry` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `pending_users_email_key`(`email`),
    UNIQUE INDEX `pending_users_verification_token_key`(`verification_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
