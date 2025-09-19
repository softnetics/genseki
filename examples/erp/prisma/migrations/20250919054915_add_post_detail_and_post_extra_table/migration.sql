-- CreateTable
CREATE TABLE "PostDetail" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostExtra" (
    "id" TEXT NOT NULL,
    "note" TEXT,
    "postDetailId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostExtra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostDetail_postId_key" ON "PostDetail"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "PostExtra_postDetailId_key" ON "PostExtra"("postDetailId");

-- AddForeignKey
ALTER TABLE "PostDetail" ADD CONSTRAINT "PostDetail_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostExtra" ADD CONSTRAINT "PostExtra_postDetailId_fkey" FOREIGN KEY ("postDetailId") REFERENCES "PostDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
