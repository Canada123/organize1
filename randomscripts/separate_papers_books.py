#!/usr/bin/env python3
import os
import shutil

try:
    import PyPDF2
except ImportError:
    print("Installing PyPDF2...")
    os.system("pip3 install PyPDF2 --break-system-packages")
    import PyPDF2

def classify_pdf(filepath):
    """Detect if PDF is a paper or book"""
    try:
        with open(filepath, 'rb') as f:
            pdf = PyPDF2.PdfReader(f)
            pages = len(pdf.pages)
            
            # Get first 3 pages text
            text = ""
            for i in range(min(3, pages)):
                text += pdf.pages[i].extract_text().lower()
            
            # Paper indicators
            paper_signals = text.count('abstract') + text.count('doi:') + text.count('arxiv') + text.count('references') + text.count('citation')
            
            # Book indicators  
            book_signals = text.count('isbn') + text.count('chapter') + text.count('publisher') + text.count('table of contents')
            
            if pages < 50 and paper_signals > 0:
                return 'PAPER'
            elif pages > 100:
                return 'BOOK'
            elif paper_signals > book_signals:
                return 'PAPER'
            else:
                return 'BOOK'
    except:
        return 'UNKNOWN'

# Configuration
SEARCH_PATH = "/Users/ashleygeness/Desktop"
PAPERS_FOLDER = "/Users/ashleygeness/Desktop/PAPERS"
BOOKS_FOLDER = "/Users/ashleygeness/Desktop/BOOKS"
UNKNOWN_FOLDER = "/Users/ashleygeness/Desktop/PDFs_UNKNOWN"

os.makedirs(PAPERS_FOLDER, exist_ok=True)
os.makedirs(BOOKS_FOLDER, exist_ok=True)
os.makedirs(UNKNOWN_FOLDER, exist_ok=True)

print("SCANNING AND ORGANIZING PDFs")
print("=" * 80)

papers_count = 0
books_count = 0
unknown_count = 0

for root, dirs, files in os.walk(SEARCH_PATH):
    # Skip destination folders
    if PAPERS_FOLDER in root or BOOKS_FOLDER in root or UNKNOWN_FOLDER in root:
        continue
    
    for file in files:
        if file.endswith('.pdf'):
            filepath = os.path.join(root, file)
            
            print(f"Classifying: {file}")
            classification = classify_pdf(filepath)
            
            if classification == 'PAPER':
                dest = os.path.join(PAPERS_FOLDER, file)
                shutil.move(filepath, dest)
                papers_count += 1
                print(f"  → PAPER")
                
            elif classification == 'BOOK':
                dest = os.path.join(BOOKS_FOLDER, file)
                shutil.move(filepath, dest)
                books_count += 1
                print(f"  → BOOK")
                
            else:
                dest = os.path.join(UNKNOWN_FOLDER, file)
                shutil.move(filepath, dest)
                unknown_count += 1
                print(f"  → UNKNOWN")

print("\n" + "=" * 80)
print("ORGANIZATION COMPLETE")
print(f"Papers moved: {papers_count} → {PAPERS_FOLDER}")
print(f"Books moved: {books_count} → {BOOKS_FOLDER}")
print(f"Unknown moved: {unknown_count} → {UNKNOWN_FOLDER}")
