#!/usr/bin/env python3
"""
generate_parse.py
=================
Batch-generate grammar parse HTML for every keySentence in
intensive-reading.json.  Uses regex-based heuristics to identify six
types of grammar structure and wraps each segment with the appropriate
<span class="g-xxx"> tag plus a small <sup class="g-label"> showing
the Chinese grammar type.

Usage:
    python generate_parse.py
"""

import json
import re
import html as _html
import os
import sys

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

JSON_PATH = os.path.join(
    r"D:\学习\效率\00-网站程序\frontend\public\data\english",
    "intensive-reading.json",
)

LABELS = {
    "g-main":     "主句",
    "g-adv":      "状语",
    "g-attr":     "定语",
    "g-clause":   "名词性从句",
    "g-nonfinite":"非谓语",
    "g-appos":    "同位语",
    "g-parallel": "并列",
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def esc(text: str) -> str:
    """Escape HTML special characters (keep quotes unescaped for readability)."""
    return _html.escape(text, quote=False)


def _clause_end(text: str, start: int) -> int:
    """
    Walk forward from *start* and return the index of the first
    clause-ending punctuation at parenthesis-depth 0.
    Clause enders: ,  ;  .  ?  !  em-dash (—)
    Respects () [] {} nesting.
    """
    depth = 0
    i = start
    n = len(text)
    while i < n:
        ch = text[i]
        if ch in "([{":
            depth += 1
        elif ch in ")]}":
            depth -= 1
            if depth < 0:
                return i          # unmatched close bracket
        elif depth == 0 and ch in ",;.?!":
            return i
        elif depth == 0 and ch == "\u2014":          # em-dash
            return i
        i += 1
    return n


def _trim_right(text: str, start: int, end: int) -> int:
    """Trim trailing whitespace from region [start, end)."""
    while end > start and text[end - 1] in " \t":
        end -= 1
    return end


def _has_subject_verb(text: str, window: int = 80) -> bool:
    """
    Crude check: does the text fragment (starting from the left) contain
    at least a subject-like word followed eventually by a verb-like word?
    Used to decide whether a clause is 'real' or just a prepositional phrase.
    """
    seg = text[:window]
    words = seg.split()
    if len(words) < 2:
        return False
    # Very rough: if there's a pronoun / determiner + another word, assume clause
    starters = {
        "the", "a", "an", "it", "he", "she", "we", "they", "i", "you",
        "this", "that", "these", "those", "his", "her", "its", "our",
        "my", "their", "some", "many", "most", "each", "every", "no",
        "one", "two", "three", "several", "few", "all", "both",
        "children", "research", "study", "results", "data", "evidence",
        "scientists", "researchers", "people", "students", "teachers",
    }
    if words[0].lower().rstrip(".,;:!?") in starters:
        return True
    # If first word is capitalised (proper noun / sentence start) and there
    # are >= 3 words, also accept
    if words[0][0].isupper() and len(words) >= 3:
        return True
    return False


# ---------------------------------------------------------------------------
# Region finders   (each returns list of (start, end, css_class, priority))
# ---------------------------------------------------------------------------

def _find_adverbial(text: str) -> list:
    """Priority 1 — adverbial clauses introduced by subordinating conjunctions."""
    multi_word = [
        "as soon as", "so that", "in order that", "even though", "even if",
        "provided that", "given that", "now that", "as long as",
        "as if", "as though", "not only",
    ]
    single_word = [
        "because", "although", "though", "when", "while", "if", "since",
        "unless", "until", "whereas", "whenever", "wherever", "once",
        "before", "after", "lest", "as",
    ]
    all_conj = multi_word + single_word
    regions = []

    for conj in all_conj:
        pat = r"(?i)\b" + re.escape(conj) + r"\b"
        for m in re.finditer(pat, text):
            pos = m.start()

            # ---- disambiguation filters ----
            # 'even if' / 'even though' already cover 'if' / 'though' in that context
            if conj == "if" and pos >= 5:
                preceding = text[max(0, pos - 6):pos].lower().strip()
                if preceding.endswith("even"):
                    continue
            if conj == "though" and pos >= 5:
                preceding = text[max(0, pos - 7):pos].lower().strip()
                if preceding.endswith("even") or preceding.endswith("as"):
                    continue
            # 'as' disambiguation: skip comparative, role, and multi-word uses
            if conj == "as":
                after_as = text[m.end():].lstrip()
                # Skip "as well as", "as soon as", "as if", "as though" (handled above)
                if re.match(r"(?i)^(well|soon|if|though|long)\b", after_as):
                    continue
                # Skip "as a/an/the + noun" without a following verb (role/preposition)
                m_role = re.match(r"(?i)^(a|an|the)\s+\w+", after_as)
                if m_role:
                    # Check if there's a verb after the noun (then it's a clause)
                    after_np = after_as[m_role.end():].lstrip()
                    if not after_np or after_np[0] in ",;.?!":
                        continue  # "as a teacher," - prepositional
                # Skip "as ... as" comparison: check if "as" appears again nearby
                ahead_30 = text[m.end():m.end() + 30]
                if re.search(r'\bas\b', ahead_30):
                    continue  # likely "as big as" comparison
                # Skip if preceded by "such" or "same" (comparison)
                before_as = text[:pos].rstrip()
                if before_as.endswith("such") or before_as.endswith("same"):
                    continue
            # 'that' inside multi-word conjunctions handled elsewhere
            if conj in ("before", "after"):
                # Skip if used as preposition: no verb within next ~6 words
                ahead = text[m.end():].strip().split()[:6]
                has_vb = False
                for w in ahead:
                    wl = w.lower().strip(".,;:!?\"'()")
                    if wl in ("was", "were", "is", "are", "has", "have", "had",
                              "did", "does", "do", "will", "would", "could",
                              "should", "may", "might", "must", "shall",
                              "became", "become", "been", "being",
                              "showed", "shown", "found", "made", "took",
                              "began", "started", "continued", "remained",
                              "grew", "developed", "increased", "decreased"):
                        has_vb = True
                        break
                    if wl.endswith("ed") or wl.endswith("ing"):
                        has_vb = True
                        break
                if not has_vb:
                    continue  # prepositional use
            if conj == "since":
                ahead = text[m.end():].strip()
                if re.match(r"^\d{4}\b", ahead):
                    continue  # "since 1990" — preposition
                # Also check for verb presence (like before/after filter)
                ahead_words = ahead.split()[:6]
                has_vb_since = False
                for w in ahead_words:
                    wl = w.lower().strip(".,;:!?\"'()")
                    if wl in ("was", "were", "is", "are", "has", "have", "had",
                              "did", "does", "do", "will", "would", "could",
                              "should", "may", "might", "must", "shall",
                              "became", "become", "been", "being",
                              "showed", "shown", "found", "made", "took",
                              "began", "started", "continued", "remained"):
                        has_vb_since = True
                        break
                    if wl.endswith("ed") or wl.endswith("ing"):
                        has_vb_since = True
                        break
                if not has_vb_since:
                    continue  # "since the recent heat" — prepositional
            # 'once' as adverb vs conjunction
            if conj == "once":
                after_once = text[m.end():].lstrip()
                # If immediately followed by a past-tense verb, it's an adverb
                m_after = re.match(r"(\w+)", after_once)
                if m_after:
                    w_after = m_after.group(1).lower()
                    if w_after.endswith("ed") or w_after in (
                        "said", "told", "insisted", "wrote", "made", "took",
                        "gave", "came", "went", "had", "was", "were",
                        "thought", "knew", "believed", "lived", "worked",
                    ):
                        continue  # adverb use: "once insisted/said/etc."

            # ---- find clause end ----
            raw_end = _clause_end(text, m.end())
            end = _trim_right(text, m.start(), raw_end)

            # Must have meaningful content (at least ~4 words after conjunction)
            inner = text[m.end():end].strip()
            if len(inner.split()) < 3:
                continue

            regions.append((pos, end, "g-adv", 1))

    return regions


# Words that commonly introduce noun-clauses (宾语从句 / 主语从句 / 同位语从句)
_NOUN_CLAUSE_VERBS = {
    "found", "showed", "shown", "said", "told", "believe", "believed",
    "think", "thought", "know", "knew", "known", "feel", "felt",
    "suggest", "suggested", "argue", "argued", "claim", "claimed",
    "report", "reported", "note", "noted", "observe", "observed",
    "reveal", "revealed", "indicate", "indicated", "demonstrate",
    "demonstrated", "prove", "proved", "proven", "confirm", "confirmed",
    "explain", "explained", "state", "stated", "assert", "asserted",
    "contend", "contended", "maintain", "maintained", "insist", "insisted",
    "warn", "warned", "admit", "admitted", "deny", "denied",
    "hope", "hoped", "fear", "feared", "expect", "expected",
    "assume", "assumed", "imply", "implied", "mean", "meant",
    "ensure", "ensured", "require", "required", "requires",
    "shows", "suggests", "indicates", "reveals", "demonstrates",
    "conclude", "concluded", "find", "discover", "discovered",
    "recognize", "recognise", "acknowledge", "acknowledged",
    "speculate", "speculated", "worry", "worried", "doubt", "doubted",
    "predict", "predicted", "estimate", "estimated", "calculate",
    "calculated",
    "is", "was", "are", "were", "be", "been", "being",
    "remains", "remained", "seems", "seemed", "appears", "appeared",
    "implies", "means", "ensures", "proves", "confirms",
    "highlights", "highlighted", "underscores", "underscored",
    "emphasizes", "emphasizes", "emphasised", "emphasized",
    "acknowledges", "acknowledged", "points", "pointed",
}

_NOUN_CLAUSE_NOUNS = {
    "fact", "idea", "notion", "belief", "hope", "fear", "possibility",
    "evidence", "proof", "news", "truth", "rumor", "rumour",
    "suggestion", "proposal", "order", "demand", "request",
    "concern", "assumption", "impression", "perception",
    "argument", "claim", "assertion", "contention",
    "view", "opinion", "position", "stance",
    "finding", "conclusion", "discovery", "realization", "realisation",
}


def _find_relative(text: str) -> list:
    """Priority 2 — relative / attributive clauses."""
    regions = []

    # ---- who / which / where / whose / whom ----
    for pron in ("who", "which", "where", "whose", "whom"):
        pat = r"(?i)\b" + pron + r"\b"
        for m in re.finditer(pat, text):
            before = text[:m.start()].rstrip()
            if not before:
                continue
            # Must be preceded by a word character (the noun it modifies)
            if not (before[-1].isalpha() or before[-1] in "',"):
                continue
            raw_end = _clause_end(text, m.end())
            end = _trim_right(text, m.start(), raw_end)
            inner = text[m.end():end].strip()
            if len(inner.split()) < 2:
                continue
            regions.append((m.start(), end, "g-attr", 2))

    # ---- that (disambiguated) ----
    for m in re.finditer(r"(?i)\bthat\b", text):
        pos = m.start()
        before_text = text[:pos].rstrip()
        if not before_text:
            continue
        words_before = before_text.split()
        last_word = words_before[-1].strip(".,;:!?\"'()\u2014\u2013\u2015—–―-").lower() if words_before else ""

        raw_end = _clause_end(text, m.end())
        end = _trim_right(text, pos, raw_end)
        inner = text[m.end():end].strip()
        if len(inner.split()) < 3:
            continue

        if last_word in _NOUN_CLAUSE_VERBS or last_word in _NOUN_CLAUSE_NOUNS:
            # Noun clause — handled separately at priority 4
            # (we add it here so overlap resolution can pick the right one)
            regions.append((pos, end, "g-clause", 4))
        elif before_text[-1].isalpha():
            # Assume relative clause
            regions.append((pos, end, "g-attr", 2))

    return regions


def _find_nonfinite(text: str) -> list:
    """Priority 3 — non-finite verb phrases (sentence-initial participles)."""
    regions = []

    # Pattern A: "Having/Being + V-ed/V-ing ..."
    m = re.match(r"(?i)^(Having|Being)\s+\w+(?:ed|en|ing)\b", text)
    if m:
        comma = text.find(",", m.end())
        if comma > 0:
            regions.append((0, comma, "g-nonfinite", 3))

    # Pattern B: General sentence-initial participial phrase
    #   "Located in ...", "Faced with ...", "Running through ..."
    m = re.match(r"(?i)^([A-Z][a-zA-Z]*(?:ed|en|ing))\b", text)
    if m and not re.match(r"(?i)^(Having|Being)\b", text):
        participle = m.group(1)
        # Filter: the word AFTER the participle must be a preposition/adverb
        # (not a bare noun, which would indicate gerund-as-modifier like
        #  "Parenting tips ..." where "Parenting" modifies "tips")
        after_part = text[m.end():].lstrip()
        next_word = re.match(r"(\w+)", after_part)
        if next_word:
            nw = next_word.group(1).lower()
            # Prepositions / adverbs that typically follow participles
            participle_followers = {
                "in", "on", "at", "by", "with", "for", "from", "to", "of",
                "as", "into", "through", "over", "under", "between", "among",
                "about", "near", "along", "across", "behind", "before",
                "after", "during", "without", "within", "beyond", "upon",
                "up", "down", "off", "out", "away", "back", "not", "only",
                "the", "a", "an", "no", "more", "less",
            }
            if nw not in participle_followers:
                # Likely "Gerund Noun ..." (subject noun phrase), not participial
                m = None  # skip

        if m:
            # Ensure this is not the main finite verb of the sentence
            # Heuristic: there must be a comma later, and after the comma a
            # new subject (capitalised word or determiner)
            comma = text.find(",", m.end())
            if 0 < comma < len(text) - 2:
                # Participial phrases are usually short (< 80 chars before comma)
                if comma > 120:
                    comma = -1
            if 0 < comma < len(text) - 2:
                after = text[comma + 1:].strip()
                if after and _has_subject_verb(after, 40):
                    regions.append((0, comma, "g-nonfinite", 3))

    # Pattern C: Past participle + by/with/in/for phrase at sentence start
    #   "Written in 1920, the novel ..."
    #   (already covered by Pattern B for -ed forms, but let's catch -en too)
    #   (also already covered)

    return regions


def _find_noun_clause(text: str) -> list:
    """Priority 4 — noun clauses introduced by what / how / whether / why."""
    regions = []
    for word in ("what", "whether", "how", "why"):
        pat = r"(?i)\b" + word + r"\b"
        for m in re.finditer(pat, text):
            # Skip sentence-initial question words in questions
            if m.start() == 0 and text.rstrip().endswith("?"):
                continue
            # Skip 'what' in exclamations "what a ..."
            if word == "what":
                after = text[m.end():].lstrip()
                if re.match(r"^(a|an)\s", after, re.IGNORECASE):
                    continue  # exclamatory "what a ..."
            raw_end = _clause_end(text, m.end())
            end = _trim_right(text, m.start(), raw_end)
            inner = text[m.end():end].strip()
            if len(inner.split()) < 3:
                continue
            regions.append((m.start(), end, "g-clause", 4))
    return regions


def _find_appositive(text: str) -> list:
    """Priority 5 — appositives and parenthetical insertions."""
    regions = []

    # Em-dash delimited: — ... —   (also handles -- and –)
    for m in re.finditer(
        r"[\u2014\u2015]{2}(.+?)[\u2014\u2015]{2}"   # —— ... ——
        r"|"
        r"\u2014([^\u2014]+?)\u2014"                    # — ... —
        r"|"
        r"\u2013([^\u2013]{2,120}?)\u2013",             # – ... –
        text,
    ):
        content = m.group(1) or m.group(2) or m.group(3) or ""
        if content.strip():
            regions.append((m.start(), m.end(), "g-appos", 5))

    # Double-dash style: " -- ... -- "
    for m in re.finditer(r"\s--\s(.+?)\s--\s", text):
        regions.append((m.start(), m.end(), "g-appos", 5))

    # Parenthetical: ( ... )
    for m in re.finditer(r"\([^)]{2,150}\)", text):
        regions.append((m.start(), m.end(), "g-appos", 5))

    # Comma-delimited appositives:
    #   ProperNoun, (a|an|the) + noun phrase, ...
    for m in re.finditer(
        r",\s+((?:a|an|the|one of the)\s+(?:\w+\s+){0,10}\w+)\s*,",
        text,
    ):
        content = m.group(1).strip()
        if len(content) > 80:
            continue
        words = set(content.lower().split())
        finite_v = {"is", "was", "were", "are", "has", "have", "had",
                     "will", "would", "can", "could", "shall", "should",
                     "may", "might", "must", "does", "do", "did"}
        if words & finite_v:
            continue
        regions.append((m.start(1), m.end(1), "g-appos", 5))

    # Comma-delimited appositives without article (conservative):
    #   ProperNoun, descriptive phrase, ...
    # Must be >= 4 words and NOT start with a preposition (to avoid list items
    # and prepositional phrases)
    for m in re.finditer(
        r",\s*((?:\w+\s+){3,12}\w+)\s*,",
        text,
    ):
        content = m.group(1).strip()
        if len(content) > 80 or len(content) < 10:
            continue
        # Must start with lowercase
        if not content[0].islower():
            continue
        # Must NOT start with a preposition (avoids ", from X to Y," etc.)
        first_word = content.split()[0].lower()
        prepositions = {
            "in", "on", "at", "by", "with", "for", "from", "to", "of",
            "as", "into", "through", "over", "under", "between", "among",
            "about", "near", "along", "across", "behind", "before",
            "after", "during", "without", "within", "beyond", "upon",
            "including", "excluding", "despite", "unlike", "via",
        }
        if first_word in prepositions:
            continue
        words_set = set(content.lower().split())
        finite_v = {"is", "was", "were", "are", "has", "have", "had",
                     "will", "would", "can", "could", "shall", "should",
                     "may", "might", "must", "does", "do", "did",
                     "and", "but", "or", "nor", "yet", "so"}
        if words_set & finite_v:
            continue
        # Preceding word must be a proper noun (capitalized)
        before = text[:m.start()].rstrip()
        if not before or not before[-1].isalpha():
            continue
        before_words = before.rstrip(".,;:!?\"'()").split()
        if before_words and before_words[-1][0].isupper():
            regions.append((m.start(1), m.end(1), "g-appos", 5))

    return regions


def _find_parallel(text: str) -> list:
    """Priority 6 — parallel independent clauses joined by coordinating conjunctions."""
    regions = []
    for m in re.finditer(r",\s*(and|but|or|yet|nor)\s+", text, re.IGNORECASE):
        conj_word = m.group(1).lower()
        after_start = m.end()
        after_text = text[after_start:].strip()

        # Must be followed by a subject (determiner / pronoun / proper noun)
        if not re.match(
            r"(?i)^(the|a|an|it|he|she|we|they|i|you|this|that|these|"
            r"those|his|her|its|our|my|their|some|many|most|each|"
            r"every|no|one|few|several|both|all|neither|either)\b",
            after_text,
        ):
            continue

        # And the after-text must contain a verb (crude: at least 4 words)
        if len(after_text.split()) < 4:
            continue

        # Find end of this independent clause
        raw_end = _clause_end(text, after_start)
        end = _trim_right(text, m.start(1), raw_end)

        if end - m.start(1) > 15:
            regions.append((m.start(1), end, "g-parallel", 6))

    return regions


# ---------------------------------------------------------------------------
# Orchestrator
# ---------------------------------------------------------------------------

def find_all_regions(sentence: str) -> list:
    """
    Collect all grammar regions from the sentence, sorted by priority.
    Returns list of (start, end, css_class, priority).
    """
    regions: list = []
    regions.extend(_find_adverbial(sentence))
    regions.extend(_find_relative(sentence))
    regions.extend(_find_nonfinite(sentence))
    regions.extend(_find_noun_clause(sentence))
    regions.extend(_find_appositive(sentence))
    regions.extend(_find_parallel(sentence))
    return regions


def resolve_overlaps(regions: list) -> list:
    """
    Greedy non-overlapping selection.
    Lower priority number = higher priority.
    Among same priority, longer region wins.
    """
    # Sort: primary key = priority (asc), secondary = length (desc)
    regions.sort(key=lambda r: (r[3], -(r[1] - r[0])))

    selected: list = []
    for region in regions:
        s, e, _cls, _pri = region
        overlap = False
        for sel_s, sel_e, _sc, _sp in selected:
            if s < sel_e and e > sel_s:
                overlap = True
                break
        if not overlap:
            selected.append(region)

    # Sort by start position for HTML generation
    selected.sort(key=lambda r: r[0])
    return selected


def build_parse_html(sentence: str, regions: list) -> str:
    """
    Wrap each region in the appropriate <span> and fill gaps with <span class="g-main">.
    """
    if not regions:
        return f'<span class="g-main">{esc(sentence)}</span>'

    parts: list[str] = []
    pos = 0

    for start, end, css, _pri in regions:
        # Clamp
        start = max(start, pos)
        if start >= end:
            continue

        # Gap before this region → main clause
        if pos < start:
            gap = sentence[pos:start]
            if gap.strip():
                parts.append(f'<span class="g-main">{esc(gap)}</span>')
            elif gap:
                parts.append(esc(gap))

        # The annotated region
        region_text = sentence[start:end]
        label = LABELS.get(css, "")
        if label and css != "g-main":
            parts.append(
                f'<span class="{css}">{esc(region_text)}'
                f'<sup class="g-label">{label}</sup></span>'
            )
        else:
            parts.append(f'<span class="{css}">{esc(region_text)}</span>')

        pos = end

    # Trailing text → main clause
    if pos < len(sentence):
        tail = sentence[pos:]
        if tail.strip():
            parts.append(f'<span class="g-main">{esc(tail)}</span>')
        elif tail:
            parts.append(esc(tail))

    return "".join(parts)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    print(f"[1/3] Reading  {JSON_PATH}")
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    total_entries = 0
    total_sentences = 0
    total_with_annotations = 0
    errors: list[str] = []
    samples: list[tuple[str, str, str]] = []   # (key, sentence, parse)

    print("[2/3] Processing keySentences ...")
    for key in sorted(data.keys()):
        entry = data[key]
        if "keySentences" not in entry:
            continue
        total_entries += 1

        for idx, ks in enumerate(entry["keySentences"]):
            sentence = ks.get("sentence", "")
            if not sentence or not sentence.strip():
                continue

            try:
                regions = find_all_regions(sentence)
                regions = resolve_overlaps(regions)
                parse_html = build_parse_html(sentence, regions)
                ks["parse"] = parse_html
                total_sentences += 1

                # Count how many have at least one annotation beyond g-main
                if any(css != "g-main" for _, _, css, _ in regions):
                    total_with_annotations += 1

                # Collect samples (first sentence of first 3 entries per year)
                if idx == 0 and len(samples) < 12:
                    samples.append((key, sentence, parse_html))

            except Exception as exc:
                err_msg = f"{key}[{idx}]: {exc}"
                errors.append(err_msg)
                ks["parse"] = f'<span class="g-main">{esc(sentence)}</span>'
                total_sentences += 1

    print(f"[3/3] Writing  {JSON_PATH}")
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # ---- Report ----
    print()
    print("=" * 60)
    print("  SUMMARY")
    print("=" * 60)
    print(f"  Entries with keySentences : {total_entries}")
    print(f"  Total sentences processed  : {total_sentences}")
    print(f"  Sentences with annotations: {total_with_annotations}")
    print(f"  Sentences (main-only)      : {total_sentences - total_with_annotations}")
    print(f"  Errors                     : {len(errors)}")
    if errors:
        for e in errors[:10]:
            print(f"    - {e}")
        if len(errors) > 10:
            print(f"    ... and {len(errors) - 10} more")
    print("=" * 60)

    # ---- Sample output ----
    print()
    print("  SAMPLE OUTPUTS")
    print("-" * 60)
    for key, sent, parse in samples[:6]:
        print(f"\n  [{key}]")
        print(f"  Sentence : {sent[:120]}{'...' if len(sent) > 120 else ''}")
        print(f"  Parse    : {parse[:250]}{'...' if len(parse) > 250 else ''}")


if __name__ == "__main__":
    main()
