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
RUN apt-get update \
  && apt-get install unzip \
  && pip install --upgrade pip \
  && pip install --install-option="--prefix=/install" -r /requirements.txt

FROM base

# Copy our application code
WORKDIR /eda

# RUN apt-get update
# RUN make

COPY --from=builder /install /usr/local

# CMD ["python"]
CMD ["gunicorn", "--bind", "0.0.0.0:8888", "--debug", "--workers=4", "--timeout=90","--chdir /eda/derive" "wsgi:app"]
# ENTRYPOINT [ "./entrypoint" ]