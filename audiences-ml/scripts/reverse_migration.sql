ALTER TABLE public.facebook_targetings DROP keyword_vector;
ALTER TABLE public.facebook_targetings DROP segments_vector_norm;
ALTER TABLE public.facebook_targetings DROP combined_topics_vector_norm;

DROP FUNCTION FUNCTION IF EXISTS pgml.norm_l2;
DROP FUNCTION FUNCTION IF EXISTS pgml.dot_product;
DROP FUNCTION FUNCTION IF EXISTS pgml.cosine_similarity;
