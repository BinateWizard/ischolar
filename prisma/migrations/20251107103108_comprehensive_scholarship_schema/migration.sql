/*
  Warnings:

  - You are about to drop the column `notes` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `program_id` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `reference_no` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `reviewed_at` on the `applications` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `applications` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the `documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scholarship_programs` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[student_id,program_cycle_id]` on the table `applications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[student_number]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `program_cycle_id` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `applications` DROP FOREIGN KEY `applications_profile_id_fkey`;

-- DropForeignKey
ALTER TABLE `applications` DROP FOREIGN KEY `applications_program_id_fkey`;

-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `documents_application_id_fkey`;

-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `documents_profile_id_fkey`;

-- DropIndex
DROP INDEX `applications_profile_id_fkey` ON `applications`;

-- DropIndex
DROP INDEX `applications_program_id_fkey` ON `applications`;

-- DropIndex
DROP INDEX `applications_reference_no_key` ON `applications`;

-- AlterTable
ALTER TABLE `applications` DROP COLUMN `notes`,
    DROP COLUMN `profile_id`,
    DROP COLUMN `program_id`,
    DROP COLUMN `reference_no`,
    DROP COLUMN `reviewed_at`,
    ADD COLUMN `answers` JSON NOT NULL,
    ADD COLUMN `decided_at` DATETIME(3) NULL,
    ADD COLUMN `decision_reason` TEXT NULL,
    ADD COLUMN `program_cycle_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `rank` INTEGER NULL,
    ADD COLUMN `score` INTEGER NULL,
    ADD COLUMN `student_id` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('DRAFT', 'SUBMITTED', 'IN_VERIFICATION', 'FOR_CLARIFICATION', 'APPROVED', 'DENIED', 'WAITLIST') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `profiles` ADD COLUMN `course` VARCHAR(191) NULL,
    ADD COLUMN `role` ENUM('STUDENT', 'REVIEWER', 'APPROVER', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    ADD COLUMN `year_level` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `documents`;

-- DropTable
DROP TABLE `scholarship_programs`;

-- CreateTable
CREATE TABLE `programs` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `programs_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `program_cycles` (
    `id` VARCHAR(191) NOT NULL,
    `program_id` VARCHAR(191) NOT NULL,
    `ay_term` VARCHAR(191) NOT NULL,
    `open_at` DATETIME(3) NOT NULL,
    `close_at` DATETIME(3) NOT NULL,
    `max_slots` INTEGER NULL,
    `budget_cap` DECIMAL(14, 2) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `program_cycles_program_id_idx`(`program_id`),
    UNIQUE INDEX `program_cycles_program_id_ay_term_key`(`program_id`, `ay_term`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requirements` (
    `id` VARCHAR(191) NOT NULL,
    `program_cycle_id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `mime_types` JSON NULL,
    `max_size_mb` INTEGER NOT NULL DEFAULT 10,
    `mandatory` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `requirements_program_cycle_id_idx`(`program_cycle_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `application_files` (
    `id` VARCHAR(191) NOT NULL,
    `application_id` VARCHAR(191) NOT NULL,
    `requirement_id` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `mime_type` VARCHAR(191) NOT NULL,
    `size_bytes` BIGINT NOT NULL,
    `status` ENUM('PENDING', 'VALID', 'INVALID') NOT NULL DEFAULT 'PENDING',
    `issues` JSON NULL,
    `uploaded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `application_files_application_id_idx`(`application_id`),
    UNIQUE INDEX `application_files_application_id_requirement_id_key`(`application_id`, `requirement_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `application_id` VARCHAR(191) NOT NULL,
    `reviewer_id` VARCHAR(191) NOT NULL,
    `checklist` JSON NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `reviews_application_id_idx`(`application_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scholarship_awards` (
    `id` VARCHAR(191) NOT NULL,
    `application_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `program_cycle_id` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `start_term` VARCHAR(191) NULL,
    `end_term` VARCHAR(191) NULL,
    `remarks` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `scholarship_awards_application_id_key`(`application_id`),
    INDEX `scholarship_awards_student_id_idx`(`student_id`),
    UNIQUE INDEX `scholarship_awards_student_id_program_cycle_id_key`(`student_id`, `program_cycle_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disbursements` (
    `id` VARCHAR(191) NOT NULL,
    `award_id` VARCHAR(191) NOT NULL,
    `period_label` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(14, 2) NOT NULL,
    `released_at` DATETIME(3) NULL,
    `reference_no` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `disbursements_award_id_idx`(`award_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` TEXT NULL,
    `type` VARCHAR(191) NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_user_id_is_read_idx`(`user_id`, `is_read`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `actor_id` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NULL,
    `details` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_subject_idx`(`subject`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `applications_program_cycle_id_status_idx` ON `applications`(`program_cycle_id`, `status`);

-- CreateIndex
CREATE INDEX `applications_student_id_idx` ON `applications`(`student_id`);

-- CreateIndex
CREATE INDEX `applications_program_cycle_id_score_idx` ON `applications`(`program_cycle_id`, `score`);

-- CreateIndex
CREATE UNIQUE INDEX `applications_student_id_program_cycle_id_key` ON `applications`(`student_id`, `program_cycle_id`);

-- CreateIndex
CREATE UNIQUE INDEX `profiles_student_number_key` ON `profiles`(`student_number`);

-- CreateIndex
CREATE INDEX `profiles_role_idx` ON `profiles`(`role`);

-- AddForeignKey
ALTER TABLE `program_cycles` ADD CONSTRAINT `program_cycles_program_id_fkey` FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requirements` ADD CONSTRAINT `requirements_program_cycle_id_fkey` FOREIGN KEY (`program_cycle_id`) REFERENCES `program_cycles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_program_cycle_id_fkey` FOREIGN KEY (`program_cycle_id`) REFERENCES `program_cycles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `application_files` ADD CONSTRAINT `application_files_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `application_files` ADD CONSTRAINT `application_files_requirement_id_fkey` FOREIGN KEY (`requirement_id`) REFERENCES `requirements`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_reviewer_id_fkey` FOREIGN KEY (`reviewer_id`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scholarship_awards` ADD CONSTRAINT `scholarship_awards_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scholarship_awards` ADD CONSTRAINT `scholarship_awards_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scholarship_awards` ADD CONSTRAINT `scholarship_awards_program_cycle_id_fkey` FOREIGN KEY (`program_cycle_id`) REFERENCES `program_cycles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disbursements` ADD CONSTRAINT `disbursements_award_id_fkey` FOREIGN KEY (`award_id`) REFERENCES `scholarship_awards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_actor_id_fkey` FOREIGN KEY (`actor_id`) REFERENCES `profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
