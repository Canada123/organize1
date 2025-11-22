import os
import csv
import subprocess
from collections import defaultdict

# Paths
download_dir = "/Users/ashleygeness/Desktop"
csv_repo = os.path.join(download_dir, "datasheets-csv")
output_dir = os.path.join(download_dir, "new_world_fields")

os.makedirs(output_dir, exist_ok=True)

# Clone repo if not exists
if not os.path.exists(csv_repo):
    print("Downloading datasheets-csv repository...")
    result = subprocess.run(
        ['git', 'clone', 'https://github.com/new-world-tools/datasheets-csv.git', csv_repo],
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        print(f"ERROR: Git clone failed")
        print(result.stderr)
        exit(1)
    print("Download complete")
else:
    print(f"Repository already exists at {csv_repo}")

all_fields = set()
field_to_files = defaultdict(list)

print("\nExtracting field names from CSV files...")

csv_count = 0
for root, dirs, files in os.walk(csv_repo):
    if '.git' in root:
        continue
    for file in files:
        if file.endswith('.csv'):
            filepath = os.path.join(root, file)
            rel_path = os.path.relpath(filepath, csv_repo)
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    reader = csv.reader(f)
                    headers = next(reader)
                    
                    for field in headers:
                        all_fields.add(field)
                        field_to_files[field].append(rel_path)
                    
                    csv_count += 1
                    print(f"  {rel_path}: {len(headers)} fields")
                    
            except Exception as e:
                print(f"  {rel_path}: ERROR - {e}")

# Simple field list
with open(f"{output_dir}/field_names.csv", 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['field_name'])
    for field in sorted(all_fields):
        writer.writerow([field])

# Field to file mapping
with open(f"{output_dir}/field_locations.csv", 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['field_name', 'file_count', 'files'])
    for field in sorted(all_fields):
        files = field_to_files[field]
        writer.writerow([field, len(files), ' | '.join(files)])

# Text summary
with open(f"{output_dir}/summary.txt", 'w', encoding='utf-8') as f:
    f.write("NEW WORLD DATASHEETS - CSV FIELD NAMES\n")
    f.write("=" * 80 + "\n\n")
    f.write(f"CSV files processed: {csv_count}\n")
    f.write(f"Total unique fields: {len(all_fields)}\n\n")
    f.write("ALL FIELDS:\n")
    f.write("-" * 80 + "\n")
    for i, field in enumerate(sorted(all_fields), 1):
        files = field_to_files[field]
        f.write(f"{i:4d}. {field:50s} (in {len(files)} files)\n")

print(f"\nComplete!")
print(f"CSV files processed: {csv_count}")
print(f"Unique fields: {len(all_fields)}")
print(f"Output: {output_dir}")
