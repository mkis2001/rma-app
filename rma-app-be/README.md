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

- Run following to install FastAPI

```
pip install "fastapi[standard]"
```

- Add `pyproject.toml` file and declare project requirements
