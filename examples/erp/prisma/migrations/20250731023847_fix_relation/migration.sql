/*
  Warnings:

  - You are about to drop the column `subCategoryIds` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `categoryIds` on the `SubCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "subCategoryIds";

-- AlterTable
ALTER TABLE "SubCategory" DROP COLUMN "categoryIds";
