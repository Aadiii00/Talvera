FROM python:3.12-slim

WORKDIR /workspace

COPY backend/ /workspace/backend/

RUN pip install --no-cache-dir \
    fastapi uvicorn pydantic pydantic-settings \
    sqlalchemy pandas numpy xgboost shap \
    ortools chromadb networkx neo4j pytest

EXPOSE 8000

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
