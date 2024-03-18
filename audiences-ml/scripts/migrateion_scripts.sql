ALTER TABLE public.facebook_targetings ADD segments_vector real[] NULL;
ALTER TABLE public.facebook_targetings ADD combined_topics_vector real[] NULL;
ALTER TABLE public.facebook_targetings ADD segments_vector_norm real NULL;
ALTER TABLE public.facebook_targetings ADD combined_topics_vector_norm real NULL;

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



-- update the existing 
update facebook_targetings
SET
    segments_vector_norm = pgml_norm_l2(segments_vector),
    combined_topics_vector_norm = pgml_norm_l2(combined_topics_vector)
 where 
 		spec->>'name' != 'FACEBOOK GENERATED'
		and jsonb_array_length(segments)>5
		and combined_topics_vector is not null and segments_vector is not null
		and pgml_norm_l2(combined_topics_vector) > 0 and pgml_norm_l2(segments_vector) > 0;
