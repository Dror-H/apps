
ALTER TABLE "facebook_targetings"
DROP COLUMN "segments_related_words",
ADD COLUMN     "segments_related_words" JSONB;
