FROM mcr.microsoft.com/playwright/python:v1.52.0-jammy

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ libffi-dev python3-dev git && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN playwright install --with-deps

COPY . .

EXPOSE 9009

CMD ["python", "app.py"]