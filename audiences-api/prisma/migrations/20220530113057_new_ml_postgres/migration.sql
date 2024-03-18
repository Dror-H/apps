
-- AlterTable
ALTER TABLE "facebook_targetings" ADD COLUMN     "combined_topics_vector" REAL[],
ADD COLUMN     "segments_vector" REAL[];

---
--- Euclidean distance from the origin
---
CREATE OR REPLACE FUNCTION pgml_norm_l2(vector REAL[])
    RETURNS REAL
    LANGUAGE plpgsql
    IMMUTABLE
    STRICT
    PARALLEL SAFE
AS $$
    BEGIN
        RETURN SQRT(SUM(squared.values))
        FROM (SELECT UNNEST(vector) * UNNEST(vector) AS values) AS squared;
    END
$$;

---
--- A projection of `a` onto `b`
---
CREATE OR REPLACE FUNCTION pgml_dot_product(a REAL[], b REAL[])
    RETURNS REAL
    LANGUAGE plpgsql
    IMMUTABLE
    STRICT
    PARALLEL SAFE
AS $$
    BEGIN
        RETURN SUM(multiplied.values)
        FROM (SELECT UNNEST(a) * UNNEST(b) AS values) AS multiplied;
    END
$$;
---
--- The size of the angle between `a` and `b`
---
CREATE OR REPLACE FUNCTION pgml_cosine_similarity(a REAL[], b REAL[])
    RETURNS REAL
    LANGUAGE plpgsql
    IMMUTABLE
    STRICT
    PARALLEL SAFE
AS $$
    BEGIN
        RETURN pgml_dot_product(a, b) / (pgml_norm_l2(a) * pgml_norm_l2(b));
    END
$$;
