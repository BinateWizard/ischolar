/*
  Warnings:

  - Made the column `type` on table `notifications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `action_url` VARCHAR(191) NULL,
    ADD COLUMN `priority` VARCHAR(191) NOT NULL DEFAULT 'NORMAL',
    ADD COLUMN `related_id` VARCHAR(191) NULL,
    MODIFY `type` ENUM('APPLICATION_SUBMITTED', 'APPLICATION_APPROVED', 'APPLICATION_DENIED', 'VERIFICATION_PENDING', 'VERIFICATION_APPROVED', 'VERIFICATION_REJECTED', 'DOCUMENT_REQUIRED', 'THRESHOLD_WARNING', 'SYSTEM_ALERT', 'REMINDER') NOT NULL;

-- CreateIndex
CREATE INDEX `notifications_created_at_idx` ON `notifications`(`created_at`);
