"""SQLite connection, history queries, and runtime welfare records."""

from __future__ import annotations

import json
import os
import sqlite3
import uuid
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from risk_engine.scoring import RiskResult


DEFAULT_DB_PATH = Path(__file__).resolve().parents[2] / "data" / "synthetic_data.sqlite3"
DB_PATH = Path(os.getenv("CAPF_API_DB", DEFAULT_DB_PATH))


def utc_now() -> str:
    """Return the current UTC time in the API's ISO format."""

    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace(
        "+00:00", "Z"
    )


def get_db_connection() -> sqlite3.Connection:
    """Get a foreign-key-enforcing connection to the synthetic SQLite database."""

    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    ensure_runtime_tables(connection)
    return connection


def ensure_runtime_tables(connection: sqlite3.Connection) -> None:
    """Create small runtime tables absent from the static seed artifact."""

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS interventions (
            id TEXT PRIMARY KEY,
            alert_id TEXT NOT NULL,
            officer_id TEXT NOT NULL,
            action_taken TEXT NOT NULL,
            notes TEXT NULL,
            status TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (alert_id) REFERENCES risk_results (id),
            FOREIGN KEY (officer_id) REFERENCES persons (person_id)
        )
        """
    )
    columns = {
        row[1]
        for row in connection.execute("PRAGMA table_info(interventions)").fetchall()
    }
    if "follow_up_date" not in columns:
        connection.execute("ALTER TABLE interventions ADD COLUMN follow_up_date TEXT NULL")
    connection.commit()


def get_demo_account(service_id: str) -> sqlite3.Row | None:
    """Retrieve demo account credentials by service ID."""

    with get_db_connection() as connection:
        return connection.execute(
            """
            SELECT person_id, service_id, password, role
            FROM demo_accounts
            WHERE service_id = ?
            """,
            (service_id,),
        ).fetchone()


def get_person_identity(person_id: str) -> sqlite3.Row | None:
    """Retrieve a person's identity and unit for JWT authorization."""

    with get_db_connection() as connection:
        return connection.execute(
            """
            SELECT person_id, unit, role
            FROM persons
            WHERE person_id = ?
            """,
            (person_id,),
        ).fetchone()


def get_person_history(person_id: str) -> dict[str, Any]:
    """Load one person's authorized history for an in-process risk calculation."""

    with get_db_connection() as connection:
        person = connection.execute(
            """
            SELECT person_id, enrolled_at, biometric_consent
            FROM persons
            WHERE person_id = ?
            """,
            (person_id,),
        ).fetchone()
        if person is None:
            raise ValueError(f"Unknown person: {person_id}")

        leave_records = [
            dict(row)
            for row in connection.execute(
                "SELECT id, person_id, date, type FROM leave_records WHERE person_id = ? ORDER BY date",
                (person_id,),
            )
        ]
        duty_records = [
            dict(row)
            for row in connection.execute(
                """
                SELECT id, person_id, date, hours, deployment_type, transfer_flag
                FROM duty_records
                WHERE person_id = ?
                ORDER BY date
                """,
                (person_id,),
            )
        ]
        checkins = []
        for row in connection.execute(
            """
            SELECT id, person_id, timestamp, mood_score, note, structured_responses
            FROM checkins
            WHERE person_id = ?
            ORDER BY timestamp
            """,
            (person_id,),
        ):
            item = dict(row)
            if item["structured_responses"]:
                item["structured_responses"] = json.loads(item["structured_responses"])
            checkins.append(item)

        biometric_consent = bool(person["biometric_consent"])
        biometric_records = (
            [
                dict(row)
                for row in connection.execute(
                    """
                    SELECT id, person_id, date, resting_hr, sleep_hours
                    FROM biometric_records
                    WHERE person_id = ?
                    ORDER BY date
                    """,
                    (person_id,),
                )
            ]
            if biometric_consent
            else []
        )

    all_dates = [
        record["date"] for record in leave_records + duty_records + biometric_records
    ] + [record["timestamp"][:10] for record in checkins]
    latest_date = max((date.fromisoformat(value[:10]) for value in all_dates), default=None)
    enrolled_at = date.fromisoformat(person["enrolled_at"])
    days_of_history = (
        max(0, (latest_date - enrolled_at).days + 1) if latest_date else 0
    )
    return {
        "person_id": person_id,
        "days_of_history": days_of_history,
        "duty_cycles_recorded": len(duty_records),
        "leave_records": leave_records,
        "duty_records": duty_records,
        "checkins": checkins,
        "biometric_consent": biometric_consent,
        "biometric_records": biometric_records,
    }


def insert_checkin(person_id: str, payload: dict[str, Any]) -> tuple[str, str]:
    """Persist a check-in and return its ID and timestamp."""

    checkin_id = f"c_{uuid.uuid4().hex[:12]}"
    timestamp = utc_now()
    with get_db_connection() as connection:
        connection.execute(
            """
            INSERT INTO checkins
            (id, person_id, timestamp, mood_score, note, structured_responses)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                checkin_id,
                person_id,
                timestamp,
                payload["mood_score"],
                payload.get("note"),
                json.dumps(payload.get("structured_responses"), ensure_ascii=False)
                if payload.get("structured_responses") is not None
                else None,
            ),
        )
        connection.commit()
    return checkin_id, timestamp


def store_risk_result(person_id: str, result: RiskResult) -> str:
    """Persist a risk result without exposing it through the check-in receipt."""

    result_id = f"r_{uuid.uuid4().hex[:12]}"
    with get_db_connection() as connection:
        connection.execute(
            """
            INSERT INTO risk_results
            (id, person_id, computed_at, status, score, flagged, factors, suggested_tier)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                result_id,
                person_id,
                utc_now(),
                result.status,
                result.score,
                int(result.flagged),
                json.dumps([factor.to_dict() for factor in result.factors]),
                result.suggested_tier,
            ),
        )
        connection.commit()
    return result_id


def list_open_alerts() -> list[sqlite3.Row]:
    """Return each person's latest flagged result and its intervention status."""

    with get_db_connection() as connection:
        return connection.execute(
            """
            SELECT latest.id, latest.person_id, latest.computed_at, latest.score,
                   latest.flagged, latest.factors, latest.suggested_tier,
                   COALESCE(
                       (SELECT i.status
                        FROM interventions i
                        WHERE i.alert_id = latest.id
                        ORDER BY i.timestamp DESC
                        LIMIT 1),
                       'open'
                   ) AS alert_status
            FROM risk_results latest
            INNER JOIN (
                SELECT person_id, MAX(computed_at) AS computed_at
                FROM risk_results
                WHERE flagged = 1
                GROUP BY person_id
            ) newest
              ON newest.person_id = latest.person_id
             AND newest.computed_at = latest.computed_at
            WHERE latest.flagged = 1
              AND COALESCE(
                  (SELECT i.status
                   FROM interventions i
                   WHERE i.alert_id = latest.id
                   ORDER BY i.timestamp DESC
                   LIMIT 1),
                  'open'
              ) <> 'closed'
            ORDER BY latest.computed_at DESC
            """
        ).fetchall()


def get_personnel_ids(unit: str | None = None) -> list[str]:
    """Return personnel identifiers in an optional authorized unit."""

    with get_db_connection() as connection:
        if unit is None:
            rows = connection.execute(
                "SELECT person_id FROM persons WHERE role = 'personnel'"
            ).fetchall()
        else:
            rows = connection.execute(
                """
                SELECT person_id
                FROM persons
                WHERE role = 'personnel' AND unit = ?
                """,
                (unit,),
            ).fetchall()
    return [row["person_id"] for row in rows]


def record_access(
    accessed_by_person_id: str,
    accessed_person_id: str,
    reason: str,
) -> None:
    """Write an audit record for an individual-level Welfare Officer view."""

    with get_db_connection() as connection:
        connection.execute(
            """
            INSERT INTO access_logs
            (id, accessed_by_person_id, accessed_person_id, timestamp, reason)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                f"log_{uuid.uuid4().hex[:12]}",
                accessed_by_person_id,
                accessed_person_id,
                utc_now(),
                reason,
            ),
        )
        connection.commit()


def get_alert(alert_id: str) -> sqlite3.Row | None:
    """Return one flagged result if it exists."""

    with get_db_connection() as connection:
        return connection.execute(
            "SELECT * FROM risk_results WHERE id = ? AND flagged = 1",
            (alert_id,),
        ).fetchone()


def get_latest_risk_result(person_id: str) -> sqlite3.Row | None:
    """Return the most recent stored risk result for one person."""

    with get_db_connection() as connection:
        return connection.execute(
            """
            SELECT id, status, score, flagged, factors, suggested_tier
            FROM risk_results
            WHERE person_id = ?
            ORDER BY computed_at DESC
            LIMIT 1
            """,
            (person_id,),
        ).fetchone()


def log_intervention(
    alert_id: str,
    officer_id: str,
    action_taken: str,
    notes: str | None,
    status: str,
    follow_up_date: str | None,
) -> None:
    """Record a Welfare Officer intervention outcome and audit identity."""

    with get_db_connection() as connection:
        timestamp = utc_now()
        connection.execute(
            """
            INSERT INTO interventions
            (id, alert_id, officer_id, action_taken, notes, status, follow_up_date, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                f"i_{uuid.uuid4().hex[:12]}",
                alert_id,
                officer_id,
                action_taken,
                notes,
                status,
                follow_up_date,
                timestamp,
            ),
        )
        alert = connection.execute(
            "SELECT person_id FROM risk_results WHERE id = ?",
            (alert_id,),
        ).fetchone()
        if alert is not None:
            connection.execute(
                """
                INSERT INTO access_logs
                (id, accessed_by_person_id, accessed_person_id, timestamp, reason)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    f"log_{uuid.uuid4().hex[:12]}",
                    officer_id,
                    alert["person_id"],
                    timestamp,
                    action_taken,
                ),
            )
        connection.commit()


def get_unit_summary(unit: str) -> dict[str, Any]:
    """Build an aggregate-only 30-day Commander summary."""

    with get_db_connection() as connection:
        personnel_count = connection.execute(
            "SELECT COUNT(*) FROM persons WHERE unit = ? AND role = 'personnel'",
            (unit,),
        ).fetchone()[0]
        open_alert_count = connection.execute(
            """
            SELECT COUNT(*)
            FROM risk_results result
            INNER JOIN (
                SELECT person_id, MAX(computed_at) AS computed_at
                FROM risk_results
                WHERE flagged = 1
                GROUP BY person_id
            ) newest
              ON newest.person_id = result.person_id
             AND newest.computed_at = result.computed_at
            INNER JOIN persons p ON p.person_id = result.person_id
            WHERE result.flagged = 1 AND p.unit = ? AND p.role = 'personnel'
              AND COALESCE(
                  (SELECT i.status
                   FROM interventions i
                   WHERE i.alert_id = result.id
                   ORDER BY i.timestamp DESC
                   LIMIT 1),
                  'open'
              ) <> 'closed'
            """,
            (unit,),
        ).fetchone()[0]

        today = date.today()
        trend: list[dict[str, Any]] = []
        for offset in range(29, -1, -1):
            point_date = today - timedelta(days=offset)
            day_end = f"{point_date.isoformat()}T23:59:59Z"
            average = connection.execute(
                """
                SELECT AVG(result.score)
                FROM risk_results result
                INNER JOIN persons p ON p.person_id = result.person_id
                WHERE p.unit = ? AND p.role = 'personnel'
                  AND result.computed_at <= ? AND result.score IS NOT NULL
                  AND result.computed_at = (
                      SELECT MAX(previous.computed_at)
                      FROM risk_results previous
                      WHERE previous.person_id = result.person_id
                        AND previous.computed_at <= ?
                  )
                """,
                (unit, day_end, day_end),
            ).fetchone()[0]
            checkin_count = connection.execute(
                """
                SELECT COUNT(DISTINCT c.person_id)
                FROM checkins c
                INNER JOIN persons p ON p.person_id = c.person_id
                WHERE p.unit = ? AND p.role = 'personnel'
                  AND substr(c.timestamp, 1, 10) = ?
                """,
                (unit, point_date.isoformat()),
            ).fetchone()[0]
            participation = (
                round((checkin_count / personnel_count) * 100, 1)
                if personnel_count
                else 0.0
            )
            trend.append(
                {
                    "date": point_date.isoformat(),
                    "avg_risk_indicator": round(float(average or 0.0), 3),
                    "checkin_participation_rate": participation,
                }
            )
    return {
        "unit": unit,
        "trend_30d": trend,
        "open_alert_count": open_alert_count,
        "personnel_count": personnel_count,
    }
