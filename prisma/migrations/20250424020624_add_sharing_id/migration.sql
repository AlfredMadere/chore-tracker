/*
  Warnings:

  - A unique constraint covering the columns `[sharingId]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "sharingId" TEXT;

-- Update existing records with UUID values
UPDATE "Group" SET "sharingId" = gen_random_uuid() WHERE "sharingId" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Group_sharingId_key" ON "Group"("sharingId");
