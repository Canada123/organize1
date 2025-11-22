#!/usr/bin/env python3
import os
from pathlib import Path
import re
import shutil

# Folders created in the directory where you run the script
PROCESSED_DIR_NAME = "ProcessedCodeblocks"
ORIGINAL_DIR_NAME = "OriginalNoBackticks"

# Detect real fenced code blocks (already have ``` or ~~~)
FENCE_START_RE = re.compile(r"^\s*(```|~~~)")
FENCE_END_RE = re.compile(r"^\s*(```|~~~)\s*$")


def looks_like_code(line: str) -> bool:
    """Heuristic: guess if a line is code."""
    s = line.strip()
    if s == "":
        return False

    # Adjust as needed; this is intentionally generous
    if (
        s.startswith("using ") or    # C#
        s.startswith("import ") or   # Python / JS
        s.startswith("public ") or
        s.startswith("private ") or
        s.startswith("protected ") or
        s.startswith("class ") or
        s.startswith("struct ") or
        s.startswith("enum ") or
        s.startswith("def ") or      # Python
        s.startswith("#include") or  # C/C++
        s.startswith("namespace ") or
        s.startswith("if ") or s.startswith("if(") or
        s.startswith("for ") or s.startswith("for(") or
        s.startswith("while ") or s.startswith("while(")
    ):
        return True

    # Things that look like statements
    if ";" in s:
        return True

    # Function-like
    if "(" in s and ")" in s and ("{" in s or ")" in s):
        return True

    return False


def add_backticks_to_md(src: Path, dst: Path) -> None:
    """
    Read src markdown, add ``` fences around lines that look like code
    (but do NOT touch existing fenced blocks), and write to dst.
    """
    with src.open("r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()

    out_lines = []

    in_real_fence = False   # inside existing ```...``` or ~~~...~~~
    in_auto_block = False   # inside a block we are auto-wrapping

    for line in lines:
        # Handle existing real fences first
        if in_real_fence:
            out_lines.append(line)
            if FENCE_END_RE.match(line):
                in_real_fence = False
            continue

        # Not in a real fence currently
        if FENCE_START_RE.match(line):
            # Start of a real fenced block (already correct)
            out_lines.append(line)
            in_real_fence = True
            # If we were in an auto block for some reason, close it before starting real fence
            if in_auto_block:
                out_lines.insert(-1, "```\n")
                in_auto_block = False
            continue

        # Handle our auto-wrapped code blocks
        if not in_auto_block:
            if looks_like_code(line):
                # Start an auto code block
                out_lines.append("```\n")
                out_lines.append(line)
                in_auto_block = True
            else:
                out_lines.append(line)
        else:
            # Currently inside auto code block
            if line.strip() == "" or not looks_like_code(line):
                # Close the auto block before adding this non-code/blank line
                out_lines.append("```\n")
                in_auto_block = False
                out_lines.append(line)
            else:
                out_lines.append(line)

    # If file ended while still in an auto block, close it
    if in_auto_block:
        out_lines.append("```\n")

    dst.parent.mkdir(parents=True, exist_ok=True)
    with dst.open("w", encoding="utf-8") as f:
        f.writelines(out_lines)


def main():
    root = Path(".").resolve()
    processed_root = root / PROCESSED_DIR_NAME
    original_root = root / ORIGINAL_DIR_NAME

    processed_root.mkdir(exist_ok=True)
    original_root.mkdir(exist_ok=True)

    md_count = 0

    for dirpath, dirnames, filenames in os.walk(root):
        current = Path(dirpath)

        # Skip our own output folders so we don't reprocess them
        if PROCESSED_DIR_NAME in current.parts or ORIGINAL_DIR_NAME in current.parts:
            continue

        for name in filenames:
            if not name.lower().endswith(".md"):
                continue

            src = current / name
            rel = src.relative_to(root)

            # Where the processed file will go
            dst_processed = processed_root / rel
            # Where the original will be stored
            dst_original = original_root / rel

            # Ensure parent dirs exist
            dst_processed.parent.mkdir(parents=True, exist_ok=True)
            dst_original.parent.mkdir(parents=True, exist_ok=True)

            # 1) Write processed file
            add_backticks_to_md(src, dst_processed)

            # 2) Move original file
            shutil.move(str(src), str(dst_original))

            md_count += 1
            print(f"Processed: {rel}")

    print("")
    print(f"Done. Markdown files processed: {md_count}")
    print(f"Processed files (with backticks): {processed_root}")
    print(f"Original files (unchanged):      {original_root}")


if __name__ == "__main__":
    main()

