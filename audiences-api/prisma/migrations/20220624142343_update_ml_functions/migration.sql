ALTER TABLE public.facebook_targetings ADD COLUMN IF NOT EXISTS segments_vector_norm real NULL;
ALTER TABLE public.facebook_targetings ADD COLUMN IF NOT EXISTS combined_topics_vector_norm real NULL;

CREATE INDEX idx_segments_vector_norm ON facebook_targetings(segments_vector_norm);
CREATE INDEX idx_combined_topics_vector_norm ON facebook_targetings(combined_topics_vector_norm);

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
CREATE OR REPLACE FUNCTION pgml_cosine_similarity(a REAL[], b REAL[], a_norm REAL, b_norm REAL)
  	RETURNS REAL
	LANGUAGE plpgsql
	IMMUTABLE
	STRICT
	PARALLEL SAFE
AS $$
	BEGIN
		RETURN pgml_dot_product(a, b) / (a_norm * b_norm);
	END
$$;

