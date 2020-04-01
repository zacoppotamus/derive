# Start with a base image
FROM python:3-onbuild as base
# FROM python:alpine3.7

FROM base as builder

WORKDIR /install
COPY requirements.txt /requirements.txt

ENV API_PORT=5000

# Fetch app specific dependencies
RUN pip install --upgrade pip
RUN pip install --install-option="--prefix=/install" -r /requirements.txt

FROM base

# Copy our application code
WORKDIR /api

COPY --from=builder /install /usr/local
COPY *.py ./

# Expose port
EXPOSE ${API_PORT}

# Start the app
CMD ["gunicorn", "--bind", "0.0.0.0:${API_PORT}", "wsgi:app", "--timeout", "140"]
