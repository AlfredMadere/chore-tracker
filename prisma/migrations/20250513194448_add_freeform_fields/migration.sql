-- AlterTable
ALTER TABLE "Chore" ADD COLUMN     "freeform" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ChoreLog" ADD COLUMN     "usedTimer" BOOLEAN NOT NULL DEFAULT false;
