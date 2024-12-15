-- CreateTable
CREATE TABLE `ChapterContent` (
    `id` VARCHAR(191) NOT NULL,
    `chapterId` VARCHAR(191) NOT NULL,
    `section` VARCHAR(191) NOT NULL,
    `explanation` TEXT NOT NULL,
    `flashcards` JSON NOT NULL,

    UNIQUE INDEX `ChapterContent_chapterId_key`(`chapterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
