This directory contains Alembic migration environment for the Backend.

Usage:

- Create a revision with autogenerate:
  ```bash
  alembic revision --autogenerate -m "create initial schema"
  ```
- Apply migrations:
  ```bash
  alembic upgrade head
  ```

Alembic reads `DATABASE_URL` from environment variables by default. Ensure it's set before running migrations.
