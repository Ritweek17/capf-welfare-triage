"""Generate deterministic, entirely synthetic records for the demo database."""

from __future__ import annotations

import argparse
import json
import random
from datetime import date, datetime, time, timedelta, timezone
from pathlib import Path
from typing import Any

try:
    from faker import Faker
except ModuleNotFoundError:  # pragma: no cover - exercised only in offline environments
    Faker = None  # type: ignore[assignment,misc]


DEFAULT_PEOPLE = 150
DEFAULT_DAYS = 90
DEFAULT_SEED = 26186
DEFAULT_OUTPUT = Path(__file__).with_name("generated_data.json")
UNITS = ("1st Company", "2nd Company", "3rd Company")
LEAVE_TYPES = {"annual", "emergency", "medical", "none_taken_this_period"}
DEPLOYMENT_TYPES = {"routine", "high_stress_posting", "training"}
RUNTIME_STATUSES = {"baseline_building", "scored"}

PERSON_FIELDS = {
    "person_id",
    "unit",
    "role",
    "enrolled_at",
    "biometric_consent",
    "is_deliberate_at_risk_profile",
}
LEAVE_FIELDS = {"id", "person_id", "date", "type"}
DUTY_FIELDS = {
    "id",
    "person_id",
    "date",
    "hours",
    "deployment_type",
    "transfer_flag",
}
CHECKIN_FIELDS = {
    "id",
    "person_id",
    "timestamp",
    "mood_score",
    "note",
    "structured_responses",
}
BIOMETRIC_FIELDS = {"id", "person_id", "date", "resting_hr", "sleep_hours"}
RISK_RESULT_FIELDS = {
    "id",
    "person_id",
    "computed_at",
    "status",
    "score",
    "flagged",
    "factors",
    "suggested_tier",
}
ACCESS_LOG_FIELDS = {
    "id",
    "accessed_by_person_id",
    "accessed_person_id",
    "timestamp",
    "reason",
}
DEMO_ACCOUNT_FIELDS = {"person_id", "service_id", "password", "role"}


def iso_date(value: date) -> str:
    """Return a schema-compatible ISO-8601 date string."""

    return value.isoformat()


def iso_datetime(value: datetime) -> str:
    """Return a UTC datetime string with the API's ``Z`` suffix."""

    return value.astimezone(timezone.utc).isoformat(timespec="seconds").replace(
        "+00:00", "Z"
    )


def date_range(start: date, days: int) -> list[date]:
    """Return an inclusive sequence of calendar dates."""

    return [start + timedelta(days=offset) for offset in range(days)]


def clamp_int(value: float, lower: int, upper: int) -> int:
    """Round a value and constrain it to an inclusive integer range."""

    return max(lower, min(upper, int(round(value))))


def make_structured_responses(
    rng: random.Random, at_risk: bool, day_index: int
) -> dict[str, int]:
    """Create the optional GMHAT-style response fields used by check-ins."""

    if at_risk and day_index >= 45:
        return {
            "sleep_quality": rng.randint(1, 2),
            "irritability": rng.randint(4, 5),
            "energy_level": rng.randint(1, 2),
        }
    return {
        "sleep_quality": rng.randint(3, 5),
        "irritability": rng.randint(1, 3),
        "energy_level": rng.randint(3, 5),
    }


def generate_leave_records(
    person_id: str,
    history_dates: list[date],
    rng: random.Random,
    at_risk: bool,
) -> list[dict[str, Any]]:
    """Generate periodic leave observations over the person's history."""

    records: list[dict[str, Any]] = []
    period_length = 14
    for period_index, period_start in enumerate(
        range(0, len(history_dates), period_length), start=1
    ):
        period_date = history_dates[min(period_start + 6, len(history_dates) - 1)]
        if at_risk:
            if period_index <= 3:
                leave_type = ("annual", "emergency", "medical")[period_index - 1]
            else:
                leave_type = "none_taken_this_period"
        else:
            roll = rng.random()
            if roll < 0.16:
                leave_type = "annual"
            elif roll < 0.21:
                leave_type = "emergency"
            elif roll < 0.24:
                leave_type = "medical"
            else:
                leave_type = "none_taken_this_period"
        records.append(
            {
                "id": f"leave_{person_id}_{period_index:02d}",
                "person_id": person_id,
                "date": iso_date(period_date),
                "type": leave_type,
            }
        )
    return records


def generate_duty_records(
    person_id: str,
    history_dates: list[date],
    rng: random.Random,
    at_risk: bool,
    short_history: bool,
) -> list[dict[str, Any]]:
    """Generate daily or deliberately sparse duty-cycle observations."""

    duty_dates = history_dates[:2] if short_history else history_dates
    records: list[dict[str, Any]] = []
    risk_transition = max(0, len(history_dates) - 30)
    for day_index, duty_date in enumerate(duty_dates):
        if at_risk and day_index >= risk_transition:
            hours = rng.randint(13, 16)
            deployment_type = "high_stress_posting"
        else:
            hours = clamp_int(rng.gauss(8.5, 1.5), 6, 12)
            deployment_roll = rng.random()
            if deployment_roll < 0.10:
                deployment_type = "training"
            elif deployment_roll < 0.18:
                deployment_type = "high_stress_posting"
            else:
                deployment_type = "routine"
        transfer_flag = day_index > 0 and rng.random() < (0.04 if at_risk else 0.02)
        records.append(
            {
                "id": f"duty_{person_id}_{day_index + 1:03d}",
                "person_id": person_id,
                "date": iso_date(duty_date),
                "hours": hours,
                "deployment_type": deployment_type,
                "transfer_flag": transfer_flag,
            }
        )
    if at_risk and records:
        records[-1]["transfer_flag"] = True
    return records


def generate_checkins(
    person_id: str,
    history_dates: list[date],
    rng: random.Random,
    fake: Any,
    at_risk: bool,
) -> list[dict[str, Any]]:
    """Generate roughly weekly check-ins, with a long final gap for risk profiles."""

    if at_risk:
        final_gap_days = 21
        final_checkin_index = len(history_dates) - final_gap_days - 1
        checkin_indices = list(range(6, max(7, final_checkin_index), 7))
        if len(history_dates) > final_gap_days:
            checkin_indices.append(final_checkin_index)
    else:
        checkin_indices = []
        index = 5
        while index < len(history_dates):
            checkin_indices.append(index)
            index += rng.randint(6, 8)

    records: list[dict[str, Any]] = []
    for sequence, day_index in enumerate(sorted(set(checkin_indices)), start=1):
        checkin_date = history_dates[day_index]
        if at_risk:
            mood_score = clamp_int(
                4.2
                - (day_index / max(1, len(history_dates) - 1)) * 2.2
                + rng.gauss(0, 0.25),
                1,
                5,
            )
        else:
            mood_score = clamp_int(rng.gauss(3.7, 0.7), 1, 5)

        note: str | None = None
        if rng.random() < 0.12:
            if fake is not None:
                note = fake.sentence(nb_words=rng.randint(4, 8)).rstrip(".")
            else:
                note = rng.choice(
                    (
                        "Routine week with regular duties",
                        "Rested well and felt steady",
                        "Busy schedule but manageable",
                        "Taking time to recharge",
                    )
                )
        structured_responses: dict[str, int] | None = None
        if rng.random() < 0.70:
            structured_responses = make_structured_responses(
                rng, at_risk, day_index
            )
        timestamp = datetime.combine(
            checkin_date,
            time(hour=rng.randint(7, 21), minute=rng.choice((0, 15, 30, 45))),
            tzinfo=timezone.utc,
        )
        records.append(
            {
                "id": f"checkin_{person_id}_{sequence:02d}",
                "person_id": person_id,
                "timestamp": iso_datetime(timestamp),
                "mood_score": mood_score,
                "note": note,
                "structured_responses": structured_responses,
            }
        )
    return records


def generate_biometrics(
    person_id: str,
    history_dates: list[date],
    rng: random.Random,
    consented: bool,
) -> list[dict[str, Any]]:
    """Generate simulated biometric records only for consented personnel."""

    if not consented:
        return []
    records: list[dict[str, Any]] = []
    for sequence, record_date in enumerate(history_dates, start=1):
        resting_hr: int | None = clamp_int(rng.gauss(68, 7), 52, 96)
        sleep_hours: float | None = round(rng.gauss(7.1, 0.9), 1)
        if rng.random() < 0.04:
            resting_hr = None
        if rng.random() < 0.04:
            sleep_hours = None
        records.append(
            {
                "id": f"biometric_{person_id}_{sequence:03d}",
                "person_id": person_id,
                "date": iso_date(record_date),
                "resting_hr": resting_hr,
                "sleep_hours": sleep_hours,
            }
        )
    return records


def generate_dataset(
    people_count: int = DEFAULT_PEOPLE,
    history_days: int = DEFAULT_DAYS,
    seed: int = DEFAULT_SEED,
    as_of: date | None = None,
) -> dict[str, list[dict[str, Any]]]:
    """Generate all schema tables plus the separate fixed demo accounts."""

    if people_count < 16:
        raise ValueError("people_count must be at least 16")
    if history_days != DEFAULT_DAYS:
        raise ValueError("history_days must be exactly 90 per DATA_SCHEMA.md")

    effective_as_of = as_of or date.today()
    rng = random.Random(seed)
    fake = Faker("en_IN") if Faker is not None else None
    if fake is not None:
        fake.seed_instance(seed)

    short_profile_count = 12
    short_profile_ids = {
        f"p_{person_index:05d}" for person_index in range(1, short_profile_count + 1)
    }
    at_risk_ids = {
        f"p_{person_index:05d}"
        for person_index in range(short_profile_count + 1, short_profile_count + 5)
    }

    persons: list[dict[str, Any]] = []
    leave_records: list[dict[str, Any]] = []
    duty_records: list[dict[str, Any]] = []
    checkins: list[dict[str, Any]] = []
    biometric_records: list[dict[str, Any]] = []

    for person_index in range(1, people_count + 1):
        person_id = f"p_{person_index:05d}"
        short_history = person_id in short_profile_ids
        at_risk = person_id in at_risk_ids
        person_history_days = (
            10 + ((person_index - 1) % 4) if short_history else history_days
        )
        enrolled_at = effective_as_of - timedelta(days=person_history_days - 1)
        history_dates = date_range(enrolled_at, person_history_days)
        consented = person_index % 5 == 0
        persons.append(
            {
                "person_id": person_id,
                "unit": UNITS[(person_index - 1) % len(UNITS)],
                "role": "personnel",
                "enrolled_at": iso_date(enrolled_at),
                "biometric_consent": consented,
                "is_deliberate_at_risk_profile": at_risk,
            }
        )
        leave_records.extend(
            generate_leave_records(person_id, history_dates, rng, at_risk)
        )
        duty_records.extend(
            generate_duty_records(
                person_id, history_dates, rng, at_risk, short_history
            )
        )
        checkins.extend(generate_checkins(person_id, history_dates, rng, fake, at_risk))
        biometric_records.extend(
            generate_biometrics(person_id, history_dates, rng, consented)
        )

    dataset: dict[str, list[dict[str, Any]]] = {
        "persons": persons,
        "leave_records": leave_records,
        "duty_records": duty_records,
        "checkins": checkins,
        "biometric_records": biometric_records,
        "risk_results": [],
        "access_logs": [],
        "demo_accounts": [
            {
                "person_id": "demo_welfare_officer",
                "service_id": "CRPF-DEMO-WELFARE",
                "password": "demo-welfare-2026",
                "role": "welfare_officer",
            },
            {
                "person_id": "demo_commander",
                "service_id": "CRPF-DEMO-COMMANDER",
                "password": "demo-commander-2026",
                "role": "commander",
            },
        ],
    }
    validate_dataset(dataset, people_count)
    return dataset


def validate_fields(rows: list[dict[str, Any]], expected: set[str], name: str) -> None:
    """Ensure each generated row has exactly the schema-defined fields."""

    for row in rows:
        if set(row) != expected:
            raise ValueError(
                f"{name} row fields differ: expected {sorted(expected)}, "
                f"got {sorted(row)}"
            )


def validate_dataset(
    dataset: dict[str, list[dict[str, Any]]], people_count: int
) -> None:
    """Validate counts, enum values, and scalar types before writing JSON."""

    validate_fields(dataset["persons"], PERSON_FIELDS, "Person")
    validate_fields(dataset["leave_records"], LEAVE_FIELDS, "LeaveRecord")
    validate_fields(dataset["duty_records"], DUTY_FIELDS, "DutyRecord")
    validate_fields(dataset["checkins"], CHECKIN_FIELDS, "CheckIn")
    validate_fields(dataset["biometric_records"], BIOMETRIC_FIELDS, "BiometricRecord")
    validate_fields(dataset["risk_results"], RISK_RESULT_FIELDS, "RiskResult")
    validate_fields(dataset["access_logs"], ACCESS_LOG_FIELDS, "AccessLog")
    validate_fields(dataset["demo_accounts"], DEMO_ACCOUNT_FIELDS, "demo_accounts")

    persons = dataset["persons"]
    if len(persons) != people_count:
        raise ValueError("generated person count does not match requested count")
    if sum(person["biometric_consent"] for person in persons) != people_count // 5:
        raise ValueError("biometric consent must be exactly 20% of monitored personnel")
    if sum(person["is_deliberate_at_risk_profile"] for person in persons) != 4:
        raise ValueError("expected exactly four deliberate at-risk profiles")

    person_ids = {person["person_id"] for person in persons}
    for person in persons:
        if person["role"] != "personnel":
            raise ValueError("monitored personnel must use the personnel role")
        if not isinstance(person["biometric_consent"], bool):
            raise TypeError("biometric_consent must be bool")
        if not isinstance(person["is_deliberate_at_risk_profile"], bool):
            raise TypeError("is_deliberate_at_risk_profile must be bool")

    for row in dataset["leave_records"]:
        if row["person_id"] not in person_ids or row["type"] not in LEAVE_TYPES:
            raise ValueError("invalid LeaveRecord foreign key or enum value")
    for row in dataset["duty_records"]:
        if (
            row["person_id"] not in person_ids
            or row["deployment_type"] not in DEPLOYMENT_TYPES
            or not isinstance(row["hours"], int)
            or not isinstance(row["transfer_flag"], bool)
        ):
            raise ValueError("invalid DutyRecord value")
    for row in dataset["checkins"]:
        if (
            row["person_id"] not in person_ids
            or not isinstance(row["mood_score"], int)
            or not 1 <= row["mood_score"] <= 5
        ):
            raise ValueError("invalid CheckIn value")
    consented_ids = {
        person["person_id"] for person in persons if person["biometric_consent"]
    }
    if {
        row["person_id"] for row in dataset["biometric_records"]
    } - consented_ids:
        raise ValueError("biometric records exist for a non-consenting person")
    for row in dataset["risk_results"]:
        if row["status"] not in RUNTIME_STATUSES:
            raise ValueError("invalid RiskResult status")
    for account in dataset["demo_accounts"]:
        if account["role"] not in {"welfare_officer", "commander"}:
            raise ValueError("invalid demo account role")
        if account["person_id"] in person_ids:
            raise ValueError("demo account overlaps monitored personnel pool")

    duty_counts = {
        person_id: sum(
            row["person_id"] == person_id for row in dataset["duty_records"]
        )
        for person_id in person_ids
    }
    short_history_count = sum(count < 3 for count in duty_counts.values())
    if not 10 <= short_history_count <= 15:
        raise ValueError("expected 10-15 personnel below the duty-cycle floor")


def parse_args() -> argparse.Namespace:
    """Parse command-line options for the generator."""

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--people", type=int, default=DEFAULT_PEOPLE)
    parser.add_argument("--days", type=int, default=DEFAULT_DAYS)
    parser.add_argument("--seed", type=int, default=DEFAULT_SEED)
    parser.add_argument("--as-of", type=date.fromisoformat, default=date.today())
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    return parser.parse_args()


def main() -> None:
    """Generate and write the synthetic dataset JSON artifact."""

    args = parse_args()
    dataset = generate_dataset(args.people, args.days, args.seed, args.as_of)
    args.output.write_text(
        json.dumps(dataset, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    print(f"Wrote {args.output}")
    duty_counts = {
        person["person_id"]: sum(
            row["person_id"] == person["person_id"]
            for row in dataset["duty_records"]
        )
        for person in dataset["persons"]
    }
    print(f"Monitored personnel: {len(dataset['persons'])}")
    short_history_count = sum(count < 3 for count in duty_counts.values())
    at_risk_count = sum(
        person["is_deliberate_at_risk_profile"] for person in dataset["persons"]
    )
    consent_count = sum(person["biometric_consent"] for person in dataset["persons"])
    print(f"Short-history personnel: {short_history_count}")
    print(f"At-risk profiles: {at_risk_count}")
    print(f"Biometric consent: {consent_count}")


if __name__ == "__main__":
    main()
