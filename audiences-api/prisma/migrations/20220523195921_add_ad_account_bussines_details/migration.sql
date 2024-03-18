-- AlterTable
ALTER TABLE "ad_accounts" ADD COLUMN     "business_city" TEXT,
ADD COLUMN     "business_country_code" TEXT,
ADD COLUMN     "business_name" TEXT,
ADD COLUMN     "business_zip" TEXT,
ADD COLUMN     "min_daily_budget" DOUBLE PRECISION NOT NULL DEFAULT 0;
