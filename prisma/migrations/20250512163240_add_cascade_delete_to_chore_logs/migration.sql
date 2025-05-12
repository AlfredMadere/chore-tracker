-- DropForeignKey
ALTER TABLE "ChoreLog" DROP CONSTRAINT "ChoreLog_choreId_fkey";

-- AddForeignKey
ALTER TABLE "ChoreLog" ADD CONSTRAINT "ChoreLog_choreId_fkey" FOREIGN KEY ("choreId") REFERENCES "Chore"("id") ON DELETE CASCADE ON UPDATE CASCADE;
