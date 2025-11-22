#!/usr/bin/env python3
"""
notes_ripper_by_topic.py

Purpose
- Recursively scan the CURRENT folder for notes that match a topic (regex or plain string).
- Follow symlinks.
- Exclude noisy dirs/files ('.git', 'node_modules', hidden dirs by default) and 'package.json'.
- Extract matched snippets and minimal metadata.
- Emit:
    1) TSV manifest:  RIPPED_<slug>/manifest.tsv
    2) Snippets file: RIPPED_<slug>/snippets.md
    3) An optional mirror of matched files via symlink (default) or copy (--copy).

Run from the root you want to search. No absolute paths required.

Examples
    python3 notes_ripper_by_topic.py --topic "Levin|bioelectric|BDSM"
    python3 notes_ripper_by_topic.py --topic "Jung|Philemon" --ext .md .txt --copy
    python3 notes_ripper_by_topic.py --topic "Conway|Game of Life" --no_mirror

Notes
- Supports text-like files: .md, .txt, .rst, .org, .json, .csv, .log
- PDF and DOCX are skipped to avoid external deps. Convert first if needed.
"""

from __future__ import annotations
import argparse, os, re, sys, csv, hashlib, shutil
from pathlib import Path

DEFAULT_EXTS = [".md",".txt",".rst",".org",".json",".csv",".log"]
SKIP_DIRS = {".git","node_modules","dist","build","__pycache__",".venv",".mypy_cache",".idea",".vscode"}
SKIP_FILES = {"package.json"}

def sha256_file(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1<<20), b""):
            h.update(chunk)
    return h.hexdigest()

def relpath(p: Path, root: Path) -> str:
    try:
        return str(p.relative_to(root))
    except Exception:
        return str(p)

def safe_slug(s: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]+","_", s.strip())[:80] or "topic"

def iter_files(root: Path, exts: list[str], follow: bool=True):
    # Use os.walk for speed; follow symlinks as requested
    for dirpath, dirnames, filenames in os.walk(root, followlinks=follow):
        # prune dirs
        base = os.path.basename(dirpath)
        if base.startswith(".") and base not in (".",):  # skip hidden dirs by default
            dirnames[:] = []  # prune
            continue
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
        for name in filenames:
            if name in SKIP_FILES: 
                continue
            if not any(name.lower().endswith(ext.lower()) for ext in exts):
                continue
            yield Path(dirpath) / name

def first_heading(lines: list[str]) -> str:
    for ln in lines:
        s = ln.strip()
        if s.startswith("#"):
            return s.lstrip("#").strip()
    return ""

def read_text(p: Path) -> str:
    try:
        return p.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""

def find_snips(txt: str, rx: re.Pattern, limit: int=8) -> list[str]:
    out = []
    for ln in txt.splitlines():
        if rx.search(ln):
            out.append(ln.strip())
            if len(out) >= limit:
                break
    return out

def main() -> int:
    ap = argparse.ArgumentParser(description="Rip notes for a topic from the current folder.")
    ap.add_argument("--topic", required=True, help="Regex or plain string to match (case-insensitive).")
    ap.add_argument("--ext", nargs="*", default=DEFAULT_EXTS, help="File extensions to include (default: common text).")
    ap.add_argument("--copy", action="store_true", help="Copy matched files instead of symlinking.")
    ap.add_argument("--no_mirror", action="store_true", help="Do not mirror matched files at all; just write outputs.")
    ap.add_argument("--max_snips", type=int, default=8, help="Snippets per file (default 8).")
    args = ap.parse_args()

    root = Path.cwd()
    rx = re.compile(args.topic, re.I)
    tag = safe_slug(args.topic)
    outdir = root / f"RIPPED_{tag}"
    outdir.mkdir(exist_ok=True)
    mirror_dir = outdir / "mirror"
    if not args.no_mirror:
        mirror_dir.mkdir(exist_ok=True)

    manifest_path = outdir / "manifest.tsv"
    snippets_path = outdir / "snippets.md"

    rows = []
    total = 0
    hits = 0

    with manifest_path.open("w", encoding="utf-8", newline="") as mf, snippets_path.open("w", encoding="utf-8") as sf:
        w = csv.writer(mf, delimiter="\t")
        w.writerow(["rel_path","bytes","sha256","first_heading","snips_count"])

        for p in iter_files(root, args.ext, follow=True):
            total += 1
            txt = read_text(p)
            if not txt:
                continue
            if not rx.search(txt):
                continue

            # matched
            hits += 1
            lines = txt.splitlines()
            snips = find_snips(txt, rx, limit=args.max_snips)
            head = first_heading(lines)
            row = [relpath(p, root), p.stat().st_size, sha256_file(p), head, len(snips)]
            w.writerow(row)

            # write snippets
            sf.write(f"## {relpath(p, root)}\n")
            if head:
                sf.write(f"> {head}\n\n")
            for i, s in enumerate(snips, 1):
                sf.write(f"{i}. {s}\n")
            sf.write("\n")

            # mirror
            if not args.no_mirror:
                dst = mirror_dir / relpath(p, root)
                dst.parent.mkdir(parents=True, exist_ok=True)
                try:
                    if args.copy:
                        if dst.exists(): 
                            dst.unlink()
                        shutil.copy2(p, dst)
                    else:
                        if dst.exists():
                            dst.unlink()
                        # Use absolute src to keep symlink valid if mirror moved inside tree
                        dst.symlink_to(p.resolve())
                except Exception as e:
                    # Continue on mirror errors; record as snippet note for visibility
                    sf.write(f"_mirror error: {e}_\n\n")

    print(f"Scanned {total} files. Matched {hits}.")
    print(f"Manifest  -> {manifest_path}")
    print(f"Snippets  -> {snippets_path}")
    if not args.no_mirror:
        print(f"Mirror dir-> {mirror_dir}")
    return 0

if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        print("Interrupted.", file=sys.stderr)
        raise SystemExit(130)
