-- CreateTable
CREATE TABLE `DBConnection` (
    `id` VARCHAR(191) NOT NULL,
    `host` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `database` VARCHAR(191) NOT NULL,
    `port` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DBConnection` ADD CONSTRAINT `DBConnection_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
