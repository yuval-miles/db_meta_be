/*
  Warnings:

  - You are about to drop the `column` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `column` DROP FOREIGN KEY `Column_tableId_fkey`;

-- DropTable
DROP TABLE `column`;

-- CreateTable
CREATE TABLE `Row` (
    `id` VARCHAR(191) NOT NULL,
    `columnName` VARCHAR(191) NOT NULL,
    `charLength` INTEGER NOT NULL,
    `dataType` VARCHAR(191) NOT NULL,
    `isNullable` VARCHAR(191) NOT NULL,
    `isPrimaryKey` INTEGER NOT NULL,
    `isForeignKey` INTEGER NOT NULL,
    `tableId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Row` ADD CONSTRAINT `Row_tableId_fkey` FOREIGN KEY (`tableId`) REFERENCES `Table`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
