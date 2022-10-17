/*
  Warnings:

  - You are about to alter the column `charLength` on the `column` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `isPrimaryKey` on the `column` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `isForeignKey` on the `column` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `column` MODIFY `charLength` INTEGER NOT NULL,
    MODIFY `isPrimaryKey` INTEGER NOT NULL,
    MODIFY `isForeignKey` INTEGER NOT NULL;
