-- CreateTable
CREATE TABLE "Ticker" (
    "id" SERIAL NOT NULL,
    "ticker" VARCHAR(255) NOT NULL,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT,
    "tickerId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarSrc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TickerLike" (
    "tickerId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TickerLike_pkey" PRIMARY KEY ("tickerId","userId")
);

-- CreateTable
CREATE TABLE "TickerDislike" (
    "tickerId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TickerDislike_pkey" PRIMARY KEY ("tickerId","userId")
);

-- CreateTable
CREATE TABLE "CommentLike" (
    "commentId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("commentId","userId")
);

-- CreateTable
CREATE TABLE "CommentDislike" (
    "commentId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CommentDislike_pkey" PRIMARY KEY ("commentId","userId")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_tickerId_fkey" FOREIGN KEY ("tickerId") REFERENCES "Ticker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TickerLike" ADD CONSTRAINT "TickerLike_tickerId_fkey" FOREIGN KEY ("tickerId") REFERENCES "Ticker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TickerLike" ADD CONSTRAINT "TickerLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TickerDislike" ADD CONSTRAINT "TickerDislike_tickerId_fkey" FOREIGN KEY ("tickerId") REFERENCES "Ticker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TickerDislike" ADD CONSTRAINT "TickerDislike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentDislike" ADD CONSTRAINT "CommentDislike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentDislike" ADD CONSTRAINT "CommentDislike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
