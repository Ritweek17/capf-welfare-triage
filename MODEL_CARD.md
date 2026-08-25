# Welfare-Support Signal Model Card

## Purpose

The risk engine is a synthetic-data prototype for helping a Welfare Officer
notice meaningful changes from one person's own historical pattern. It is a
welfare-support signal, not a diagnosis, disciplinary tool, or fitness-for-duty
decision.

## Inputs and outputs

- Inputs: duty hours, deployment intensity, leave observations, voluntary
  check-in activity and mood responses, plus simulated biometric fields only
  when `biometric_consent` is true.
- Output: `baseline_building` until there are at least 14 history days and 3
  duty-cycle records; otherwise an interpretable score, factors, and a
  suggested human-support tier.
- Every flagged result includes contributing factors. Personnel receive only a
  check-in receipt; individual scores and flags are restricted to Welfare
  Officers, while Commanders receive aggregates only.

## Method and limitations

The model compares recent observations with the same person's baseline using
robust, transparent deviation calculations. It is unsupervised and does not
use fabricated stress, suicide, incident, or clinical labels. Missing check-ins
are treated as missing data and may produce a separate activity-gap factor;
they are not treated as evidence of poor wellbeing. A single unusual period is
protected by the current-window aggregation and explainable thresholding.

The data is entirely synthetic, so this prototype reports scenario behavior,
not clinical accuracy, fairness, or real-world predictive performance. Human
review is required before any welfare action, and no automated decision should
be made from the signal alone.

## Demo validation

The deterministic scenario tests cover stable baseline, workload escalation,
deployment/recovery imbalance, voluntary wellness decline, false-positive
protection, cold start, and biometric consent gating. The integration rehearsal
also verifies the full synthetic path from check-in through alert, intervention,
and Commander aggregate without manual database edits.
