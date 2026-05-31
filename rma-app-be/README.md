# FastAPI APP Setup (win)

[Fast API - web](https://fastapi.tiangolo.com/)

### 1. Activate virtual environment

```
.venv\Scripts\Activate.ps1
```

- When you're done working on a project, deactivate it using `deactivate`

### 2. Upgrade pip

```
python -m pip install --upgrade pip
```

### 3. Add `.gitignore`

- Write `*` into `.gitignore¸` to exclude everything in `.venv` from git

### 4. Install packages

- set up poetry

```
pipx install poetry
```

- set dependencies in pyproject.toml or during poetry setup

```
dependencies = [
    "fastapi (>=0.136.1,<0.137.0)",
    "uvicorn[standard]",
    "pydantic (>=2.13.4,<3.0.0)"
]

[dependency-groups]
dev = [
    "ruff (>=0.15.14,<0.16.0)",
    "mypy (>=2.1.0,<3.0.0)",
    "pytest (>=9.0.3,<10.0.0)"
]
```

- install set dependencies using poetry

```
poetry install
```

### 5. Start application

```
uvicorn app.main:app --reload
```
