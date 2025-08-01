-- DropForeignKey
ALTER TABLE "Verification" DROP CONSTRAINT "Verification_userId_fkey";

-- AlterTable
ALTER TABLE "Verification" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
