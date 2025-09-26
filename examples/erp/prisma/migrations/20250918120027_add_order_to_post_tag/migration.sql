/*
  Warnings:

  - Added the required column `order` to the `PostTag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PostTag" ADD COLUMN     "order" TEXT NOT NULL;
