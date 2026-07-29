from __future__ import annotations

import json
import re
from hashlib import sha256
from pathlib import Path

from docx import Document


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / "资料分享" / "知识库"
OUTPUT = ROOT / "server" / "knowledge.json"
SOURCES_OUTPUT = ROOT / "server" / "project-sources.json"
MAX_CHARS = 760


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.replace("\u00a0", " ")).strip()


def chunk_paragraphs(paragraphs: list[str]) -> list[str]:
    chunks: list[str] = []
    current: list[str] = []
    length = 0

    for paragraph in paragraphs:
        if current and length + len(paragraph) > MAX_CHARS:
            chunks.append("\n".join(current))
            current = []
            length = 0
        current.append(paragraph)
        length += len(paragraph)

    if current:
        chunks.append("\n".join(current))
    return chunks


def file_digest(path: Path) -> str:
    return sha256(path.read_bytes()).hexdigest().upper()


def database_tables(schema: str) -> list[dict[str, object]]:
    table_pattern = re.compile(
        r"CREATE TABLE(?: IF NOT EXISTS)?\s+[`\"]?(\w+)[`\"]?\s*\((.*?)\);",
        re.IGNORECASE | re.DOTALL,
    )
    records: list[dict[str, object]] = []
    for table_name, body in table_pattern.findall(schema):
        columns: list[str] = []
        for line in body.splitlines():
            candidate = line.strip().rstrip(",")
            if not candidate or candidate.upper().startswith(("FOREIGN KEY", "PRIMARY KEY", "UNIQUE", "CHECK")):
                continue
            match = re.match(r"[`\"]?([A-Za-z_][A-Za-z0-9_]*)[`\"]?(?:\s+|$)", candidate)
            if match:
                columns.append(match.group(1))
        records.append({"name": table_name, "columns": columns})
    return records


def main() -> None:
    records: list[dict[str, str | int]] = []
    sources: list[dict[str, str | int]] = []
    for path in sorted(SOURCE.glob("*.docx")):
        document = Document(path)
        paragraphs = [normalize(p.text) for p in document.paragraphs]
        paragraphs = [p for p in paragraphs if p]
        title = paragraphs[0] if paragraphs else path.stem
        for index, content in enumerate(chunk_paragraphs(paragraphs)):
            records.append(
                {
                    "id": f"{path.stem}-{index + 1}",
                    "source": path.name,
                    "title": title,
                    "content": content,
                    "order": index + 1,
                }
            )
        sources.append(
            {
                "name": path.name,
                "sha256": file_digest(path),
                "chunks": sum(1 for record in records if record["source"] == path.name),
            }
        )

    schema_path = SOURCE / "db.txt"
    schema = schema_path.read_text(encoding="utf-8-sig")
    source_manifest = {
        "generated_by": "孙铭炜",
        "knowledge_sources": sources,
        "database_schema": {"name": schema_path.name, "sha256": file_digest(schema_path)},
        "database_tables": database_tables(schema),
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    SOURCES_OUTPUT.write_text(
        json.dumps(source_manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(
        f"Extracted {len(records)} knowledge chunks and "
        f"{len(source_manifest['database_tables'])} database tables"
    )


if __name__ == "__main__":
    main()
