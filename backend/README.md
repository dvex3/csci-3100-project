## Installation

### Create venv

```
python -m venv .venv
source venv/bin/activate # Linux
.\.venv\Scripts\activate # Windows
```

### Install dependencies

```
pip install --upgrade pip setuptools wheel
pip install -e .[dev]
```

---

## Usage

### Run server

```
flask run --debug
```

API documentation available at `/api/v1/ui`

### Database migration

```
flask db init # only when migration folder doesn't exist
flask db migrate --message "<change message>"
flask db upgrade
```

### Dev tools

```
black <file/folder> # formats code
flake8 <file/folder> # linting warnings
pytest # linting warnings + unit tests
tox # linting + unit tests
```
