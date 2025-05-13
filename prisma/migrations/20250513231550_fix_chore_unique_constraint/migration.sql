/*
  Warnings:

  - A unique constraint covering the columns `[name,groupId]` on the table `Chore` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Chore_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Chore_name_groupId_key" ON "Chore"("name", "groupId");
