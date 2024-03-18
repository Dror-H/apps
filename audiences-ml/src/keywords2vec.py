import os
from typing import List, Optional

import psycopg
from pqdm.processes import pqdm
from sentence_transformers import SentenceTransformer

# conn_str = os.environ['CONN']
conn_str = "postgresql://doadmin:gmmk1px7as29xgh7@instigo-prod-do-user-7992668-0.b.db.ondigitalocean.com:25060/audiences?sslmode=require"

model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def get_rows_to_update():
    """
    This function returns the rows of the facebook_targetings table that need to be updated.
    """
    with psycopg.connect(conn_str) as conn:
        with conn.cursor() as cur:
            cur.execute("""SELECT facebook_targetings.id as id,
            COALESCE(user_tags,'[]'::jsonb)  || jsonb_path_query_array(topics, 'strict $.**.term')::jsonb as combined_topics,
            segments
        FROM facebook_targetings
        WHERE spec->>'name'!='FACEBOOK GENERATED'
            and jsonb_array_length(segments)>5
            AND (combined_topics_vector is null or segments_vector is null)
            """)
            rows = cur.fetchall()
            return rows


def update_rows_bulk():
    """
    Could not get that to work...
    This function updates the vectors of the segments and the combined_topics of the facebook_targetings table.
    """
    rows = get_rows_to_update()
    ids, combined_topics_vector, segments_vector = zip(*[(row[0], convert_keywords_to_vectors(row[1]), convert_keywords_to_vectors(row[2])) for row in rows])

    with psycopg.connect(conn_str) as conn:
        with conn.cursor() as cur:
            cur.execute("""
            update facebook_targetings
            SET
                segments_vector = data_table.segments_vector,
                combined_topics_vector = data_table.combined_topics_vector
            FROM
                (select unnest(%s::uuid[]) as id,
                        unnest(%s::real) as segments_vector,
                        unnest(%s::real) as combined_topics_vector) as data_table
            WHERE facebook_targetings.id = data_table.id;
            """, [ids, segments_vector, combined_topics_vector])
            conn.commit()


def update_single_row(row):
    segments_vector = convert_keywords_to_vectors(row[1])
    combined_topics_vector = convert_keywords_to_vectors(row[2])
    with psycopg.connect(conn_str) as conn:
        with conn.cursor() as cur:
            cur.execute("""
            update facebook_targetings
            SET
                segments_vector = %s,
                combined_topics_vector = %s,
                segments_vector_norm = pgml_norm_l2(%s),
                combined_topics_vector_norm = pgml_norm_l2(%s)
            WHERE facebook_targetings.id = %s;
            """, [segments_vector, combined_topics_vector, segments_vector, combined_topics_vector, row[0]])
            conn.commit()

def update_rows():
    """
    This function updates the vectors of the segments and the combined_topics of the facebook_targetings table.
    """
    rows = get_rows_to_update()
    pqdm(rows, update_single_row, n_jobs=2)

def convert_keywords_to_vectors(keywords: Optional[List[str]]) -> List[float]:
    if not keywords:
        return [0] * model.get_sentence_embedding_dimension()

    _keywords = set(keywords)
    _keywords = [k for k in _keywords if k is not None]
    encoded_sentence = model.encode(_keywords)
    return encoded_sentence.sum(axis=0).tolist()


if __name__ == '__main__':
    update_rows()
