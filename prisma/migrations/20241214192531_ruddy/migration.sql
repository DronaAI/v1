/*
  Warnings:

  - You are about to drop the column `explanation` on the `ChapterContent` table. All the data in the column will be lost.
  - You are about to drop the column `flashcards` on the `ChapterContent` table. All the data in the column will be lost.
  - You are about to drop the column `section` on the `ChapterContent` table. All the data in the column will be lost.
  - Added the required column `keyPoints` to the `ChapterContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `ChapterContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ChapterContent` DROP COLUMN `explanation`,
    DROP COLUMN `flashcards`,
    DROP COLUMN `section`,
    ADD COLUMN `keyPoints` JSON NOT NULL,
    ADD COLUMN `summary` JSON NOT NULL;
