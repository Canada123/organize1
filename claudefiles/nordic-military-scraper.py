#!/usr/bin/env python3
"""
Nordic Military Training Materials Scraper
Gathers publicly available military training documents, manuals, and educational resources
"""

import requests
import os
import time
import json
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import PyPDF2
import hashlib

class MilitaryTrainingScraper:
    def __init__(self, output_dir="military_training_materials"):
        self.output_dir = output_dir
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Educational Research Bot) Military Training Materials Collector/1.0'
        })
        self.create_directories()
        self.materials_index = []
        
    def create_directories(self):
        """Create organized directory structure"""
        dirs = [
            "manuals/doctrine",
            "manuals/field_manuals", 
            "manuals/training_guides",
            "curricula/officer_programs",
            "curricula/nco_programs",
            "curricula/specialized_training",
            "research/reports",
            "research/studies",
            "exercises/plans",
            "exercises/after_action",
            "regulations/nato",
            "regulations/national"
        ]
        for d in dirs:
            os.makedirs(os.path.join(self.output_dir, d), exist_ok=True)

    def scrape_danish_materials(self):
        """Scrape Danish military training materials"""
        sources = {
            "military_manual": "https://www.forsvaret.dk/en/publications/military-manual/",
            "defence_college": "https://www.fak.dk/en/publications/",
            "home_guard": "https://www.hjemmevaernet.dk/en/publications/"
        }
        
        for name, url in sources.items():
            try:
                resp = self.session.get(url, timeout=30)
                soup = BeautifulSoup(resp.content, 'html.parser')
                
                # Find PDF links
                pdf_links = soup.find_all('a', href=lambda x: x and x.endswith('.pdf'))
                for link in pdf_links:
                    pdf_url = urljoin(url, link['href'])
                    self.download_file(pdf_url, f"manuals/doctrine/danish_{name}")
                    
            except Exception as e:
                print(f"Error scraping {name}: {e}")

    def scrape_finnish_materials(self):
        """Scrape Finnish military training materials"""
        sources = {
            "conscript_guide": "https://intti.fi/documents/",
            "defence_forces": "https://puolustusvoimat.fi/en/documents/",
            "ndu": "https://maanpuolustuskorkeakoulu.fi/en/publications"
        }
        
        for name, url in sources.items():
            try:
                # Finnish sites often require specific paths
                if "intti" in url:
                    self.scrape_intti_materials()
                elif "puolustusvoimat" in url:
                    self.scrape_finnish_defence_materials()
                    
            except Exception as e:
                print(f"Error scraping Finnish {name}: {e}")

    def scrape_norwegian_materials(self):
        """Scrape Norwegian military training materials"""
        
        # NATO Cold Weather Operations Manual
        cold_weather_url = "https://www.act.nato.int/publications/"
        
        # Norwegian doctrine sites
        sources = {
            "ffi_reports": "https://www.ffi.no/en/publications/",
            "defence_univ": "https://www.forsvaret.no/en/organisation/nduc/publications",
            "cold_weather": "https://www.forsvaret.no/en/organisation/centre-of-excellence-cold-weather-operations/doctrine"
        }
        
        for name, url in sources.items():
            try:
                resp = self.session.get(url, timeout=30)
                soup = BeautifulSoup(resp.content, 'html.parser')
                
                # Find publication links
                links = soup.find_all('a', class_=['publication-link', 'download', 'pdf'])
                for link in links:
                    if link.get('href'):
                        file_url = urljoin(url, link['href'])
                        self.download_file(file_url, f"manuals/doctrine/norwegian_{name}")
                        
            except Exception as e:
                print(f"Error scraping Norwegian {name}: {e}")

    def scrape_swedish_materials(self):
        """Scrape Swedish military training materials"""
        sources = {
            "foi_reports": "https://www.foi.se/en/reports",
            "defence_univ": "https://www.fhs.se/en/swedish-defence-university/publications.html",
            "armed_forces": "https://www.forsvarsmakten.se/en/publications/"
        }
        
        for name, url in sources.items():
            try:
                resp = self.session.get(url, timeout=30)
                soup = BeautifulSoup(resp.content, 'html.parser')
                
                # Swedish sites often use specific patterns
                if "foi.se" in url:
                    self.scrape_foi_reports()
                    
            except Exception as e:
                print(f"Error scraping Swedish {name}: {e}")

    def scrape_nordefco_materials(self):
        """Scrape NORDEFCO cooperation materials"""
        base_url = "https://www.nordefco.org/"
        
        try:
            resp = self.session.get(base_url + "publications", timeout=30)
            soup = BeautifulSoup(resp.content, 'html.parser')
            
            # Find all document links
            for link in soup.find_all('a', href=True):
                href = link['href']
                if any(ext in href.lower() for ext in ['.pdf', '.docx', '.doc']):
                    file_url = urljoin(base_url, href)
                    self.download_file(file_url, "regulations/nato/nordefco")
                    
        except Exception as e:
            print(f"Error scraping NORDEFCO: {e}")

    def scrape_nato_standards(self):
        """Scrape NATO training standards and doctrine"""
        nato_sources = [
            "https://www.act.nato.int/publications/",
            "https://www.jallc.nato.int/publications/",
            "https://www.jwc.nato.int/publications/"
        ]
        
        for url in nato_sources:
            try:
                resp = self.session.get(url, timeout=30)
                soup = BeautifulSoup(resp.content, 'html.parser')
                
                # Find ATP and STANAG documents
                for link in soup.find_all('a', text=lambda t: t and ('ATP' in t or 'STANAG' in t)):
                    if link.get('href'):
                        doc_url = urljoin(url, link['href'])
                        self.download_file(doc_url, "regulations/nato/standards")
                        
            except Exception as e:
                print(f"Error scraping NATO standards: {e}")

    def scrape_curricula(self):
        """Scrape actual course curricula and syllabi"""
        curricula_sources = {
            "danish_officer": "https://www.fak.dk/en/education/officer-education/curriculum/",
            "finnish_ndu": "https://maanpuolustuskorkeakoulu.fi/en/studies/curricula",
            "norwegian_officer": "https://www.forsvaret.no/en/organisation/nduc/education/curricula",
            "swedish_officer": "https://www.fhs.se/en/swedish-defence-university/education/programmes/officers-programme/curriculum.html"
        }
        
        for name, url in curricula_sources.items():
            try:
                resp = self.session.get(url, timeout=30)
                soup = BeautifulSoup(resp.content, 'html.parser')
                
                # Extract curriculum documents
                for link in soup.find_all('a', href=lambda x: x and ('curriculum' in x.lower() or 'syllabus' in x.lower())):
                    doc_url = urljoin(url, link['href'])
                    self.download_file(doc_url, f"curricula/officer_programs/{name}")
                    
            except Exception as e:
                print(f"Error scraping {name} curriculum: {e}")

    def scrape_exercise_materials(self):
        """Scrape exercise plans and after-action reports"""
        exercise_sources = {
            "nordic_response": "https://www.forsvaret.no/en/exercises-and-operations/exercises/nr24/documents",
            "joint_viking": "https://www.forsvaret.no/en/exercises-and-operations/exercises/jv25/documents",
            "locked_shields": "https://ccdcoe.org/exercises/locked-shields/reports/"
        }
        
        for name, url in exercise_sources.items():
            try:
                resp = self.session.get(url, timeout=30)
                soup = BeautifulSoup(resp.content, 'html.parser')
                
                # Find exercise documents
                for link in soup.find_all('a', href=lambda x: x and any(term in x.lower() for term in ['plan', 'report', 'aar', 'lessons'])):
                    doc_url = urljoin(url, link['href'])
                    self.download_file(doc_url, f"exercises/plans/{name}")
                    
            except Exception as e:
                print(f"Error scraping {name} exercise materials: {e}")

    def scrape_research_papers(self):
        """Scrape military research papers and studies"""
        research_sources = {
            "foi": "https://www.foi.se/en/foi/reports/report-database.html",
            "ffi": "https://www.ffi.no/en/publications/archive/",
            "fhs": "https://www.fhs.se/en/swedish-defence-university/research/publications.html"
        }
        
        for name, url in research_sources.items():
            try:
                resp = self.session.get(url, timeout=30)
                soup = BeautifulSoup(resp.content, 'html.parser')
                
                # Find research reports
                for link in soup.find_all('a', class_=['report-link', 'publication-link', 'download']):
                    if link.get('href'):
                        report_url = urljoin(url, link['href'])
                        self.download_file(report_url, f"research/reports/{name}")
                        
            except Exception as e:
                print(f"Error scraping {name} research: {e}")

    def scrape_specialized_training(self):
        """Scrape specialized training materials (arctic, cyber, etc)"""
        
        # Arctic warfare materials
        arctic_sources = {
            "cold_weather_ops": "https://www.forsvaret.no/en/organisation/centre-of-excellence-cold-weather-operations/publications",
            "winter_warfare": "https://maavoimat.fi/en/jaeger-brigade/winter-training-materials"
        }
        
        # Cyber training materials  
        cyber_sources = {
            "crate": "https://www.foi.se/en/foi/research/information-security/crate-documents.html",
            "cyber_conscript": "https://intti.fi/en/cyber/training-materials"
        }
        
        all_sources = {**arctic_sources, **cyber_sources}
        
        for name, url in all_sources.items():
            try:
                resp = self.session.get(url, timeout=30)
                soup = BeautifulSoup(resp.content, 'html.parser')
                
                # Download specialized materials
                for link in soup.find_all('a', href=lambda x: x and x.endswith(('.pdf', '.docx'))):
                    doc_url = urljoin(url, link['href'])
                    category = "arctic" if name in arctic_sources else "cyber"
                    self.download_file(doc_url, f"curricula/specialized_training/{category}/{name}")
                    
            except Exception as e:
                print(f"Error scraping {name}: {e}")

    def download_file(self, url, subfolder):
        """Download a file and save it organized by type"""
        try:
            # Create unique filename
            parsed = urlparse(url)
            filename = os.path.basename(parsed.path)
            if not filename:
                filename = hashlib.md5(url.encode()).hexdigest()[:8] + '.pdf'
                
            filepath = os.path.join(self.output_dir, subfolder, filename)
            
            # Skip if already downloaded
            if os.path.exists(filepath):
                print(f"Already downloaded: {filename}")
                return
                
            # Download file
            print(f"Downloading: {filename}")
            resp = self.session.get(url, timeout=60, stream=True)
            resp.raise_for_status()
            
            # Save file
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, 'wb') as f:
                for chunk in resp.iter_content(chunk_size=8192):
                    f.write(chunk)
                    
            # Add to index
            self.materials_index.append({
                'url': url,
                'filename': filename,
                'path': filepath,
                'subfolder': subfolder,
                'size': os.path.getsize(filepath),
                'downloaded': time.strftime('%Y-%m-%d %H:%M:%S')
            })
            
            # Be polite
            time.sleep(1)
            
        except Exception as e:
            print(f"Error downloading {url}: {e}")

    def extract_text_from_pdfs(self):
        """Extract text from downloaded PDFs for analysis"""
        print("\nExtracting text from PDFs...")
        
        for root, dirs, files in os.walk(self.output_dir):
            for file in files:
                if file.endswith('.pdf'):
                    pdf_path = os.path.join(root, file)
                    txt_path = pdf_path.replace('.pdf', '.txt')
                    
                    if os.path.exists(txt_path):
                        continue
                        
                    try:
                        with open(pdf_path, 'rb') as f:
                            reader = PyPDF2.PdfReader(f)
                            text = ""
                            for page in reader.pages:
                                text += page.extract_text()
                                
                        with open(txt_path, 'w', encoding='utf-8') as f:
                            f.write(text)
                            
                        print(f"Extracted text from: {file}")
                        
                    except Exception as e:
                        print(f"Error extracting from {file}: {e}")

    def create_materials_database(self):
        """Create searchable database of materials"""
        db_path = os.path.join(self.output_dir, "materials_database.json")
        
        # Categorize materials
        categorized = {
            'doctrine': [],
            'training_guides': [],
            'curricula': [],
            'research': [],
            'exercises': [],
            'regulations': []
        }
        
        for item in self.materials_index:
            for category in categorized.keys():
                if category in item['subfolder']:
                    categorized[category].append(item)
                    break
                    
        # Save database
        with open(db_path, 'w') as f:
            json.dump({
                'metadata': {
                    'total_files': len(self.materials_index),
                    'download_date': time.strftime('%Y-%m-%d'),
                    'categories': list(categorized.keys())
                },
                'materials': categorized,
                'full_index': self.materials_index
            }, f, indent=2)
            
        print(f"\nDatabase created: {db_path}")
        print(f"Total materials: {len(self.materials_index)}")
        for cat, items in categorized.items():
            print(f"  {cat}: {len(items)} files")

    def run_full_scrape(self):
        """Run complete scraping operation"""
        print("Starting Nordic Military Training Materials Collection")
        print("=" * 50)
        
        # Scrape each country
        print("\n[1/8] Scraping Danish materials...")
        self.scrape_danish_materials()
        
        print("\n[2/8] Scraping Finnish materials...")
        self.scrape_finnish_materials()
        
        print("\n[3/8] Scraping Norwegian materials...")
        self.scrape_norwegian_materials()
        
        print("\n[4/8] Scraping Swedish materials...")
        self.scrape_swedish_materials()
        
        print("\n[5/8] Scraping NORDEFCO materials...")
        self.scrape_nordefco_materials()
        
        print("\n[6/8] Scraping NATO standards...")
        self.scrape_nato_standards()
        
        print("\n[7/8] Scraping curricula...")
        self.scrape_curricula()
        
        print("\n[8/8] Scraping exercise materials...")
        self.scrape_exercise_materials()
        
        # Process materials
        self.extract_text_from_pdfs()
        self.create_materials_database()
        
        print("\n" + "=" * 50)
        print("Collection complete!")
        print(f"Materials saved to: {self.output_dir}")

# Additional specialized scrapers

def scrape_specific_manuals():
    """Direct download of key military manuals"""
    
    key_manuals = {
        # Danish
        "Danish_Military_Manual_International_Law": "https://www.forsvaret.dk/globalassets/fko---forsvaret/dokumenter/publikationer/-military-manual-on-international-law-2020-.pdf",
        
        # NATO Cold Weather
        "ATP-3.2.1.5_Cold_Weather_Operations": "https://www.act.nato.int/publications/atp-3-2-1-5",
        
        # Finnish
        "Finnish_Conscript_Guide": "https://intti.fi/documents/1951251/2005630/Varusmiesopas_2024_EN.pdf",
        
        # Add more direct URLs as found
    }
    
    scraper = MilitaryTrainingScraper()
    for name, url in key_manuals.items():
        scraper.download_file(url, "manuals/doctrine/key_documents")

if __name__ == "__main__":
    # Run full scrape
    scraper = MilitaryTrainingScraper()
    scraper.run_full_scrape()
    
    # Get specific key manuals
    scrape_specific_manuals()
