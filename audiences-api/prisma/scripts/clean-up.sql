-- DELETE
--   FROM facebook_targetings
--   WHERE id IN
--           (SELECT id
--             from
--                 (SELECT id,
--                         ROW_NUMBER() OVER(PARTITION BY segments
--                                           ORDER BY id) AS row_num
--                 from facebook_targetings) r
--             WHERE r.row_num > 1);

DELETE
FROM user_targetings
WHERE targeting_id IN
        (SELECT id
         from facebook_targetings
         where jsonb_array_length(spec->'targeting'->'flexible_spec')=0
             or spec->'targeting'->'flexible_spec' is NULL);


DELETE
FROM facebook_targetings
WHERE id IN
        (SELECT id
         from facebook_targetings
         where jsonb_array_length(spec->'targeting'->'flexible_spec')=0
             or spec->'targeting'->'flexible_spec' is NULL);


DELETE
FROM user_targetings
WHERE targeting_id IN
        (SELECT id
         from facebook_targetings
         where spec->'targeting'->'flexible_spec'->0->'interests' is NULL
             and spec->'targeting'->'flexible_spec'->0->'industries' is NULL
             and spec->'targeting'->'flexible_spec'->0->'work_employers' is NULL
             and spec->'targeting'->'flexible_spec'->0->'work_positions' is NULL
             and spec->'targeting'->'flexible_spec'->0->'family_statuses' is NULL
             and spec->'targeting'->'flexible_spec'->0->'behaviors' is NULL
             and jsonb_array_length(segments)<10);


DELETE
FROM facebook_targetings
WHERE id IN (
    SELECT id
    from facebook_targetings where spec->'targeting'->'flexible_spec'->0->'interests' is NULL
    and spec->'targeting'->'flexible_spec'->0->'industries' is NULL
    and spec->'targeting'->'flexible_spec'->0->'work_employers' is NULL
    and spec->'targeting'->'flexible_spec'->0->'work_positions' is NULL
    and spec->'targeting'->'flexible_spec'->0->'family_statuses' is NULL
    and spec->'targeting'->'flexible_spec'->0->'behaviors' is NULL
    and jsonb_array_length(segments)<10
);

