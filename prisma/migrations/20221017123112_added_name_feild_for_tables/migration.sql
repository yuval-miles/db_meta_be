/*
  Warnings:

  - Added the required column `name` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `table` ADD COLUMN `name` VARCHAR(191) NOT NULL;
