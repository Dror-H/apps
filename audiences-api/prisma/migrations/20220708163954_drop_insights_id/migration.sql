/*
  Warnings:

  - The primary key for the `facebook_targeting_insights` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `facebook_targeting_insights` table. All the data in the column will be lost.
  - You are about to drop the column `combined_topics_vector_norm` on the `facebook_targetings` table. All the data in the column will be lost.
  - You are about to drop the column `insights_id` on the `facebook_targetings` table. All the data in the column will be lost.
  - You are about to drop the column `segments_vector_norm` on the `facebook_targetings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ad_set_id]` on the table `facebook_targeting_insights` will be added. If there are existing duplicate values, this will fail.
  - Made the column `ad_set_id` on table `facebook_targeting_insights` required. This step will fail if there are existing NULL values in that column.

*/

-- AlterTable
ALTER TABLE "facebook_targeting_insights" DROP CONSTRAINT "facebook_targeting_insights_pkey",
DROP COLUMN "id",
ALTER COLUMN "ad_set_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "facebook_targetings"  DROP COLUMN "insights_id";

-- CreateIndex
CREATE UNIQUE INDEX "facebook_targeting_insights_ad_set_id_key" ON "facebook_targeting_insights"("ad_set_id");
