FROM python:3-onbuild as base
LABEL MAINTAINER="zacoppotamus@gmail.com"

FROM base as builder

# ENV DB_HOST=localhost
# ENV DB_PORT=5432
# ENV DB_NAME=postgres
# ENV DB_USER=postgres
# ENV DB_PASS=admin

WORKDIR /install
COPY requirements.txt /requirements.txt

# Fetch app specific dependencies
RUN apt-get install unzip \
  && pip install --upgrade pip \
  && pip install --install-option="--prefix=/install" -r /requirements.txt

# WORKDIR /embeddings
# RUN apt-get install unzip \
#   && curl -X http://nlp.stanford.edu/data/glove.6B.zip . \
#   && unzip glove.6B.zip \
#   && find . ! -name 'glove.6B.100d.txt' -type f -exec rm -f {} +

# WORKDIR /metadata
# RUN curl -X https://archive.org/download/freesound4s/0_1.json.zip . \
#   && curl -X https://archive.org/download/freesound4s/1_2.json.zip . \
#   && curl -X https://archive.org/download/freesound4s/2_3.json.zip . \
#   && curl -X https://archive.org/download/freesound4s/3_4.json.zip . \
#   && unzip *.zip \
#   && rm *.zip


FROM base

# Copy our application code
WORKDIR /eda

RUN apt-get update

COPY --from=builder /install /usr/local

# COPY /embeddings /embeddings
# COPY --from=builder /embeddings ./
# COPY /src ./
CMD ["python"]
# ENTRYPOINT [ "./entrypoint" ]