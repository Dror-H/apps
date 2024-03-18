CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "SocialProvider" AS ENUM ('facebook');

-- CreateEnum
CREATE TYPE "TokenStatus" AS ENUM ('active', 'expired', 'revoked');

-- CreateTable
CREATE TABLE "facebook_targetings" (
    "id" UUID NOT NULL,
    "spec" JSONB NOT NULL,
    "segments" JSONB,
    "topics" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "user_tags" JSONB,
    "search_vector" tsvector,
    "insights_id" INTEGER,

    CONSTRAINT "facebook_targetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_targeting_insights" (
    "id" SERIAL NOT NULL,
    "ad_set_id" TEXT,
    "spend" DOUBLE PRECISION,
    "impressions" DOUBLE PRECISION,
    "social_spend" DOUBLE PRECISION,
    "reach" DOUBLE PRECISION,
    "clicks" DOUBLE PRECISION,
    "unique_clicks" DOUBLE PRECISION,
    "inline_link_clicks" DOUBLE PRECISION,
    "inline_post_engagement" DOUBLE PRECISION,
    "unique_ctr" DOUBLE PRECISION,
    "instant_experience_clicks_to_open" DOUBLE PRECISION,
    "instant_experience_clicks_to_start" DOUBLE PRECISION,
    "cpm" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "cpp" DOUBLE PRECISION,
    "ctr" DOUBLE PRECISION,
    "quality_ranking" TEXT,
    "frequency" DOUBLE PRECISION,
    "cost_per_inline_link_click" DOUBLE PRECISION,
    "cost_per_inline_post_engagement" DOUBLE PRECISION,
    "cost_per_unique_click" DOUBLE PRECISION,
    "cost_per_unique_inline_link_click" DOUBLE PRECISION,
    "engagement_rate_ranking" TEXT,
    "inline_link_click_ctr" DOUBLE PRECISION,

    CONSTRAINT "facebook_targeting_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_segments" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "disambiguation_category" TEXT,
    "category" TEXT,
    "topic" TEXT,
    "audience_size_lower_bound" INTEGER,
    "audience_size_upper_bound" INTEGER,
    "path" JSONB,
    "search_vector" tsvector,

    CONSTRAINT "facebook_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "provider" "SocialProvider",
    "status" TEXT DEFAULT E'active',
    "business_profile_picture" TEXT,
    "synchronized" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currency" TEXT NOT NULL DEFAULT E'USD',

    CONSTRAINT "ad_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "stripe_customer_id" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "profile_picture" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "access_token" TEXT NOT NULL,
    "status" "TokenStatus" DEFAULT E'active',
    "provider" "SocialProvider" NOT NULL,
    "provider_client_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ad_account_to_user" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "facebook_targetings_id_key" ON "facebook_targetings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "facebook_segments_id_key" ON "facebook_segments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ad_accounts_id_key" ON "ad_accounts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_tokens_id_key" ON "auth_tokens"("id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_tokens_provider_client_id_key" ON "auth_tokens"("provider_client_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ad_account_to_user_AB_unique" ON "_ad_account_to_user"("A", "B");

-- CreateIndex
CREATE INDEX "_ad_account_to_user_B_index" ON "_ad_account_to_user"("B");

-- AddForeignKey
ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ad_account_to_user" ADD FOREIGN KEY ("A") REFERENCES "ad_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ad_account_to_user" ADD FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;


CREATE INDEX ix_search_vector_facebook_targetings ON facebook_targetings USING GIN (search_vector);
CREATE INDEX ix_search_vector_facebook_segments ON facebook_segments USING GIN (search_vector);
