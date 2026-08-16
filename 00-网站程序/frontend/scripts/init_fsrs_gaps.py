"""
Initialize FSRS spaced repetition states for math knowledge gaps.

Reads gaps-math.json, creates corresponding WeakPoint entries with initial
FSRS state (matching createNewCard() from fsrs.ts), and merges them into
the feynman store's math.json. Also marks gaps as fsrsInitialized.
"""

import json
import os
from datetime import datetime

# Paths
GAPS_PATH = r"D:\学习\效率\feynman-review\gaps-math.json"
FEYNMAN_PATH = r"D:\学习\效率\00-网站程序\frontend\public\data\feynman\math.json"


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def create_new_fsrs_state():
    """Mirrors createNewCard() from fsrs.ts"""
    return {
        "difficulty": 0,
        "stability": 0,
        "elapsedDays": 0,
        "scheduledDays": 0,
        "reps": 0,
        "lapses": 0,
        "state": "new",
        "lastReview": None,
        "due": None,
    }


def gap_to_weak_point(gap):
    """Convert a gap entry into a WeakPoint for the feynman store."""
    return {
        "id": f"wp-gap-{gap['id']}",
        "topic": gap["chapter"],
        "concept": gap["topic"],
        "description": gap["description"],
        "severity": gap["severity"],  # high/medium/low maps directly
        "status": "unresolved",
        "createdAt": gap["createdAt"],
        "lastReviewAt": None,
        "reviewCount": 0,
        "fsrs": create_new_fsrs_state(),
    }


def main():
    # Load both files
    gaps_data = load_json(GAPS_PATH)
    feynman_data = load_json(FEYNMAN_PATH)

    gaps = gaps_data.get("gaps", [])
    weak_points = feynman_data.get("weakPoints", [])

    # Build set of existing weak point IDs for dedup
    existing_ids = {wp["id"] for wp in weak_points}

    added_count = 0
    skipped_count = 0

    for gap in gaps:
        wp = gap_to_weak_point(gap)
        if wp["id"] in existing_ids:
            skipped_count += 1
            print(f"  SKIP: {wp['id']} ({gap['topic']}) - already exists")
            continue

        weak_points.append(wp)
        existing_ids.add(wp["id"])
        added_count += 1
        print(f"  ADD:  {wp['id']} ({gap['topic']})")

        # Mark gap as fsrsInitialized
        gap["fsrsInitialized"] = True

    # Update feynman data
    feynman_data["weakPoints"] = weak_points

    # Recompute stats
    total = len(weak_points)
    resolved = sum(1 for wp in weak_points if wp.get("status") == "resolved")
    feynman_data["stats"]["totalWeakPoints"] = total
    feynman_data["stats"]["resolvedCount"] = resolved
    feynman_data["updatedAt"] = datetime.now().astimezone().isoformat()

    # Write both files
    save_json(FEYNMAN_PATH, feynman_data)
    save_json(GAPS_PATH, gaps_data)

    print(f"\nDone! Added {added_count} weak points, skipped {skipped_count}.")
    print(f"Total weak points in feynman store: {total}")
    print(f"Files updated:")
    print(f"  - {FEYNMAN_PATH}")
    print(f"  - {GAPS_PATH}")


if __name__ == "__main__":
    main()
