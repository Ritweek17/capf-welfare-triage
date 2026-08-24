import sqlite3
from pathlib import Path

# Resolve data/synthetic_data.sqlite3 relative to this file
DB_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "synthetic_data.sqlite3"

def get_db_connection() -> sqlite3.Connection:
    """Get a connection to the synthetic SQLite database."""
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection

def get_demo_account(service_id: str) -> sqlite3.Row | None:
    """Retrieve demo account credentials by service_id.
    
    IMPORTANT: Production systems must use password hashing (e.g. Argon2/bcrypt).
    This demo uses plaintext passwords sourced from the seeded synthetic dataset.
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT person_id, service_id, password, role FROM demo_accounts WHERE service_id = ?",
            (service_id,)
        )
        return cursor.fetchone()

def get_person_identity(person_id: str) -> sqlite3.Row | None:
    """Retrieve the person identity from the persons table."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT person_id, unit, role FROM persons WHERE person_id = ?",
            (person_id,)
        )
        return cursor.fetchone()

