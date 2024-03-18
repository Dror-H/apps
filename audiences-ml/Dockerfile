FROM python:3.9
ARG miroservice_name="audiences-ml"
WORKDIR /code

COPY ./apps/$miroservice_name/requirements.txt /code/requirements.txt
COPY ./apps/$miroservice_name/src /code/app

RUN /usr/local/bin/python -m pip install --upgrade pip && \
  pip install --no-cache-dir --upgrade -r requirements.txt

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
