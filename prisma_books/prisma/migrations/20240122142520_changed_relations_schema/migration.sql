/*
  Warnings:

  - You are about to drop the column `isbn` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the `_BookToPublisher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_BookToPublisher` DROP FOREIGN KEY `_BookToPublisher_A_fkey`;

-- DropForeignKey
ALTER TABLE `_BookToPublisher` DROP FOREIGN KEY `_BookToPublisher_B_fkey`;

-- AlterTable
ALTER TABLE `Book` DROP COLUMN `isbn`,
    ADD COLUMN `publisherId` INTEGER UNSIGNED NULL;

-- DropTable
DROP TABLE `_BookToPublisher`;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_publisherId_fkey` FOREIGN KEY (`publisherId`) REFERENCES `Publisher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
