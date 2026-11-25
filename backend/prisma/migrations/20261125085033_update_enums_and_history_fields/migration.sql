/*
  Warnings:

  - The `from_status` column on the `ticket_history` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `tickets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `priority` column on the `tickets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(150)` to `VarChar(100)`.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `to_status` on the `ticket_history` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'AGENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- DropIndex
DROP INDEX "tickets_assigned_to_idx";

-- DropIndex
DROP INDEX "tickets_created_by_idx";

-- DropIndex
DROP INDEX "tickets_status_idx";

-- AlterTable
ALTER TABLE "ticket_comments" ADD COLUMN     "is_internal" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ticket_history" ADD COLUMN     "from_assignee_id" INTEGER,
ADD COLUMN     "to_assignee_id" INTEGER,
DROP COLUMN "from_status",
ADD COLUMN     "from_status" "TicketStatus",
DROP COLUMN "to_status",
ADD COLUMN     "to_status" "TicketStatus" NOT NULL;

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "closed_at" TIMESTAMPTZ,
DROP COLUMN "status",
ADD COLUMN     "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
DROP COLUMN "priority",
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE INDEX "ticket_comments_ticket_id_created_at_idx" ON "ticket_comments"("ticket_id", "created_at");

-- CreateIndex
CREATE INDEX "ticket_history_ticket_id_created_at_idx" ON "ticket_history"("ticket_id", "created_at");

-- CreateIndex
CREATE INDEX "tickets_status_priority_created_at_idx" ON "tickets"("status", "priority", "created_at");

-- CreateIndex
CREATE INDEX "tickets_created_by_created_at_idx" ON "tickets"("created_by", "created_at");

-- CreateIndex
CREATE INDEX "tickets_assigned_to_status_idx" ON "tickets"("assigned_to", "status");

-- CreateIndex
CREATE INDEX "tickets_category_id_idx" ON "tickets"("category_id");

-- CreateIndex
CREATE INDEX "users_role_is_active_idx" ON "users"("role", "is_active");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- AddForeignKey
ALTER TABLE "ticket_history" ADD CONSTRAINT "ticket_history_from_assignee_id_fkey" FOREIGN KEY ("from_assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_history" ADD CONSTRAINT "ticket_history_to_assignee_id_fkey" FOREIGN KEY ("to_assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
