-- CreateTable
CREATE TABLE `Publisher` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BookToPublisher` (
    `A` INTEGER UNSIGNED NOT NULL,
    `B` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `_BookToPublisher_AB_unique`(`A`, `B`),
    INDEX `_BookToPublisher_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_BookToPublisher` ADD CONSTRAINT `_BookToPublisher_A_fkey` FOREIGN KEY (`A`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookToPublisher` ADD CONSTRAINT `_BookToPublisher_B_fkey` FOREIGN KEY (`B`) REFERENCES `Publisher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
