"""This module performs two activities:
1. It converts the segments and the topics of the facebook_targetings table into vectors.
2. It converts given keywords into vectors and returns them for search (in the typescript)

"""
import uvicorn
from typing import Union, List

from fastapi import FastAPI, BackgroundTasks, Query
from .keywords2vec import update_rows, convert_keywords_to_vectors

app = FastAPI()

@app.get("/")
def read_root():
    return { "status": 'up', "visit": 'https://instigo.io/' };


@app.get("/convert_keywords/")
async def read_item(q: Union[List[str], None] = Query(default=None)):
    return convert_keywords_to_vectors(q)

def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.post("/update")
async def update_vectors(background_tasks: BackgroundTasks):
    background_tasks.add_task(update_rows)
    return "OK"

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
