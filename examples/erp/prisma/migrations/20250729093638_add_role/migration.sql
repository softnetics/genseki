-- AlterTable
ALTER TABLE
  "User"
ADD
  COLUMN "banned" BOOLEAN NOT NULL DEFAULT false,
ADD
  COLUMN "bannedAt" TIMESTAMP(3),
ADD
  COLUMN "bannedExpiredAt" TIMESTAMP(3),
ADD
  COLUMN "bannedReason" TEXT,
ADD
  COLUMN "roles" TEXT [];