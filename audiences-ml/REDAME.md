## Basic idea:

- Every audience will be a sentence-transformer output vector of all its keywords.
- A search will transform the given keywords to a a vector as well
- the comparison between the given keywords and the audience keywords is done inside postgresql

## Technical details:

- The vectors are stored as a REAL[] column in the postgresql
- Comparison is done using L2 distance (Eucledean) or cosine_similarity between the vectors on the SQL server itself
- keywords are converted into vectors, summed and then compared to both the topics and the segments
- the result is averaged and ranked descending.
