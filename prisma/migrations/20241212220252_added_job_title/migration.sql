/*
  Warnings:

  - You are about to drop the `QuizResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `QuizResult`;

-- CreateTable
CREATE TABLE `UnitQuizResult` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `unitId` VARCHAR(191) NOT NULL,
    `completedAt` DATETIME(3) NULL,

    INDEX `userId`(`userId`),
    INDEX `unitId`(`unitId`),
    UNIQUE INDEX `UnitQuizResult_userId_unitId_key`(`userId`, `unitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChapterQuizResult` (
    `id` VARCHAR(191) NOT NULL,
    `unitQuizResultId` VARCHAR(191) NOT NULL,
    `chapterId` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `completedAt` DATETIME(3) NULL,

    INDEX `chapterId`(`chapterId`),
    UNIQUE INDEX `ChapterQuizResult_unitQuizResultId_chapterId_key`(`unitQuizResultId`, `chapterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
