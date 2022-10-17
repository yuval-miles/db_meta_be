-- CreateTable
CREATE TABLE `Table` (
    `id` VARCHAR(191) NOT NULL,
    `x` DOUBLE NOT NULL,
    `y` DOUBLE NOT NULL,
    `height` DOUBLE NOT NULL,
    `updated_At` DATETIME(3) NOT NULL,
    `dbId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Column` (
    `id` VARCHAR(191) NOT NULL,
    `columnName` VARCHAR(191) NOT NULL,
    `charLength` VARCHAR(191) NOT NULL,
    `dataType` VARCHAR(191) NOT NULL,
    `isNullable` VARCHAR(191) NOT NULL,
    `isPrimaryKey` VARCHAR(191) NOT NULL,
    `isForeignKey` VARCHAR(191) NOT NULL,
    `tableId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Edge` (
    `id` VARCHAR(191) NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `target` VARCHAR(191) NOT NULL,
    `sourceHandle` VARCHAR(191) NOT NULL,
    `targetHandle` VARCHAR(191) NOT NULL,
    `dbId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Table` ADD CONSTRAINT `Table_dbId_fkey` FOREIGN KEY (`dbId`) REFERENCES `DBConnection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Column` ADD CONSTRAINT `Column_tableId_fkey` FOREIGN KEY (`tableId`) REFERENCES `Table`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Edge` ADD CONSTRAINT `Edge_dbId_fkey` FOREIGN KEY (`dbId`) REFERENCES `DBConnection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
