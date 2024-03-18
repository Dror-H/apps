-- CreateTable
CREATE TABLE "user_targetings" (
    "user_id" UUID NOT NULL,
    "targeting_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_targetings_pkey" PRIMARY KEY ("user_id","targeting_id")
);

-- AddForeignKey
ALTER TABLE "user_targetings" ADD CONSTRAINT "user_targetings_targeting_id_fkey" FOREIGN KEY ("targeting_id") REFERENCES "facebook_targetings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_targetings" ADD CONSTRAINT "user_targetings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
