-- CreateTable
CREATE TABLE "keyword_synonyms" (
    "id" UUID NOT NULL,
    "keyword" TEXT NOT NULL,
    "synonyms" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "keyword_synonyms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "keyword_synonyms_id_key" ON "keyword_synonyms"("id");

-- CreateIndex
CREATE UNIQUE INDEX "keyword_synonyms_keyword_key" ON "keyword_synonyms"("keyword");
