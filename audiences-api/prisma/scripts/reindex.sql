WITH numbered AS
    ( SELECT id,
             row_number() OVER (
                                ORDER BY id) AS rn
     FROM facebook_targetings )
UPDATE facebook_targetings
SET search_vector = vector.val
FROM
    ( SELECT selection.id,
             setweight(to_tsvector(coalesce(user_tags::text, '')), 'A') || setweight(to_tsvector(jsonb_path_query_array (topics, 'strict $.**.term')::text), 'A') || setweight(to_tsvector(coalesce(segments::text, '')), 'B') AS val
     FROM facebook_targetings selection) vector
WHERE vector.id = facebook_targetings.id;

with numbered as
    (select id,
            row_number() over (
                               order by id) as rn
     from facebook_segments)
update facebook_segments
set search_vector = vector.val
from
    (select selection.id,
            setweight(to_tsvector(coalesce(selection.name,'')), 'A') as val
     from facebook_segments selection) vector
where vector.id = facebook_segments.id;
