"""Seed the generated synthetic records into a local SQLite database."""

from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path
from typing import Any


DEFAULT_INPUT = Path(__file__).with_name("generated_data.json")
DEFAULT_DATABASE = Path(__file__).with_name("synthetic_data.sqlite3")


TABLE_DEFINITIONS = {
    "persons": """
        CREATE TABLE persons (
            person_id TEXT PRIMARY KEY,
            unit TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('personnel', 'welfare_officer', 'commander')),
            enrolled_at TEXT NOT NULL,
            biometric_consent INTEGER NOT NULL CHECK (biometric_consent IN (0, 1)),
            is_deliberate_at_risk_profile INTEGER NOT NULL CHECK (is_deliberate_at_risk_profile IN (0, 1))
        )
    """,
    "leave_records": """
        CREATE TABLE leave_records (
            id TEXT PRIMARY KEY,
            person_id TEXT NOT NULL,
            date TEXT NOT NULL,
            type TEXT NOT NULL CHECK (type IN ('annual', 'emergency', 'medical', 'none_taken_this_period')),
            FOREIGN KEY (person_id) REFERENCES persons (person_id)
        )
    """,
    "duty_records": """
        CREATE TABLE duty_records (
            id TEXT PRIMARY KEY,
            person_id TEXT NOT NULL,
            date TEXT NOT NULL,
            hours INTEGER NOT NULL,
            deployment_type TEXT NOT NULL CHECK (deployment_type IN ('routine', 'high_stress_posting', 'training')),
            transfer_flag INTEGER NOT NULL CHECK (transfer_flag IN (0, 1)),
            FOREIGN KEY (person_id) REFERENCES persons (person_id)
        )
    """,
    "checkins": """
        CREATE TABLE checkins (
            id TEXT PRIMARY KEY,
            person_id TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            mood_score INTEGER NOT NULL CHECK (mood_score BETWEEN 1 AND 5),
            note TEXT NULL,
            structured_responses TEXT NULL,
            FOREIGN KEY (person_id) REFERENCES persons (person_id)
        )
    """,
    "biometric_records": """
        CREATE TABLE biometric_records (
            id TEXT PRIMARY KEY,
            person_id TEXT NOT NULL,
            date TEXT NOT NULL,
            resting_hr INTEGER NULL,
            sleep_hours REAL NULL,
            FOREIGN KEY (person_id) REFERENCES persons (person_id)
        )
    """,
    "risk_results": """
        CREATE TABLE risk_results (
            id TEXT PRIMARY KEY,
            person_id TEXT NOT NULL,
            computed_at TEXT NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('baseline_building', 'scored')),
            score REAL NULL,
            flagged INTEGER NOT NULL CHECK (flagged IN (0, 1)),
            factors TEXT NULL,
            suggested_tier TEXT NULL,
            FOREIGN KEY (person_id) REFERENCES persons (person_id)
        )
    """,
    "access_logs": """
        CREATE TABLE access_logs (
            id TEXT PRIMARY KEY,
            accessed_by_person_id TEXT NOT NULL,
            accessed_person_id TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            reason TEXT NULL,
            FOREIGN KEY (accessed_by_person_id) REFERENCES persons (person_id),
            FOREIGN KEY (accessed_person_id) REFERENCES persons (person_id)
        )
    """,
    "demo_accounts": """
        CREATE TABLE demo_accounts (
            person_id TEXT PRIMARY KEY,
            service_id TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('personnel', 'welfare_officer', 'commander'))
        )
    """,
}


def load_dataset(input_path: Path) -> dict[str, list[dict[str, Any]]]:
    """Load the generator's JSON artifact."""

    with input_path.open(encoding="utf-8") as data_file:
        dataset = json.load(data_file)
    if not isinstance(dataset, dict):
        raise ValueError("generated dataset must be a JSON object")
    return dataset


def json_value(value: Any) -> str | None:
    """Serialize JSON-valued schema fields for SQLite TEXT storage."""

    if value is None:
        return None
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def create_tables(connection: sqlite3.Connection) -> None:
    """Create the schema tables used by the synthetic dataset."""

    for table_name in reversed(tuple(TABLE_DEFINITIONS)):
        connection.execute(f"DROP TABLE IF EXISTS {table_name}")
    for definition in TABLE_DEFINITIONS.values():
        connection.execute(definition)


def insert_dataset(
    connection: sqlite3.Connection, dataset: dict[str, list[dict[str, Any]]]
) -> None:
    """Insert each generated table using the DATA_SCHEMA field order."""

    connection.executemany(
        """
        INSERT INTO persons
        (person_id, unit, role, enrolled_at, biometric_consent, is_deliberate_at_risk_profile)
        VALUES (:person_id, :unit, :role, :enrolled_at, :biometric_consent, :is_deliberate_at_risk_profile)
        """,
        [
            {
                **person,
                "biometric_consent": int(person["biometric_consent"]),
                "is_deliberate_at_risk_profile": int(
                    person["is_deliberate_at_risk_profile"]
                ),
            }
            for person in dataset["persons"]
        ],
    )
    connection.executemany(
        "INSERT INTO leave_records (id, person_id, date, type) VALUES (:id, :person_id, :date, :type)",
        dataset["leave_records"],
    )
    connection.executemany(
        """
        INSERT INTO duty_records
        (id, person_id, date, hours, deployment_type, transfer_flag)
        VALUES (:id, :person_id, :date, :hours, :deployment_type, :transfer_flag)
        """,
        [
            {**record, "transfer_flag": int(record["transfer_flag"])}
            for record in dataset["duty_records"]
        ],
    )
    connection.executemany(
        """
        INSERT INTO checkins
        (id, person_id, timestamp, mood_score, note, structured_responses)
        VALUES (:id, :person_id, :timestamp, :mood_score, :note, :structured_responses)
        """,
        [
            {
                **record,
                "structured_responses": json_value(record["structured_responses"]),
            }
            for record in dataset["checkins"]
        ],
    )
    connection.executemany(
        """
        INSERT INTO biometric_records
        (id, person_id, date, resting_hr, sleep_hours)
        VALUES (:id, :person_id, :date, :resting_hr, :sleep_hours)
        """,
        dataset["biometric_records"],
    )
    connection.executemany(
        """
        INSERT INTO risk_results
        (id, person_id, computed_at, status, score, flagged, factors, suggested_tier)
        VALUES (:id, :person_id, :computed_at, :status, :score, :flagged, :factors, :suggested_tier)
        """,
        [
            {
                **record,
                "flagged": int(record["flagged"]),
                "factors": json_value(record["factors"]),
            }
            for record in dataset["risk_results"]
        ],
    )
    connection.executemany(
        """
        INSERT INTO access_logs
        (id, accessed_by_person_id, accessed_person_id, timestamp, reason)
        VALUES (:id, :accessed_by_person_id, :accessed_person_id, :timestamp, :reason)
        """,
        dataset["access_logs"],
    )
    connection.executemany(
        """
        INSERT INTO demo_accounts (person_id, service_id, password, role)
        VALUES (:person_id, :service_id, :password, :role)
        """,
        dataset["demo_accounts"],
    )


def seed_database(input_path: Path, database_path: Path) -> None:
    """Create a fresh SQLite database and seed the generated records."""

    dataset = load_dataset(input_path)
    database_path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(database_path) as connection:
        connection.execute("PRAGMA foreign_keys = ON")
        create_tables(connection)
        insert_dataset(connection, dataset)


def print_sample_rows(database_path: Path, limit: int = 3) -> None:
    """Print up to three rows from each seeded table for sanity checking."""

    with sqlite3.connect(database_path) as connection:
        connection.row_factory = sqlite3.Row
        for table_name in TABLE_DEFINITIONS:
            rows = connection.execute(
                f"SELECT * FROM {table_name} LIMIT ?", (limit,)
            ).fetchall()
            print(f"\n[{table_name}] ({len(rows)} sample row(s))")
            for row in rows:
                print(json.dumps(dict(row), ensure_ascii=False, default=str))


def parse_args() -> argparse.Namespace:
    """Parse command-line options for the database seeder."""

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--database", type=Path, default=DEFAULT_DATABASE)
    parser.add_argument("--sample", type=int, default=3)
    return parser.parse_args()


def main() -> None:
    """Seed the SQLite database and print representative rows."""

    args = parse_args()
    if args.sample < 0:
        raise ValueError("sample must be non-negative")
    seed_database(args.input, args.database)
    print(f"Seeded {args.database} from {args.input}")
    print_sample_rows(args.database, args.sample)


if __name__ == "__main__":
    main()
