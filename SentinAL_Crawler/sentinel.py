import time
import json
import hashlib
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup

# --- CONFIGURATION ---
TARGET_URL = "http://localhost:8080/pirate-site.html"
API_ENDPOINT = "http://127.0.0.1:8000/api/report/"

def calculate_hash(content):
    """Generates SHA-256 fingerprint of the HTML evidence."""
    return hashlib.sha256(content.encode('utf-8')).hexdigest()

def run_crawler():
    print(f"[*] Sentinel Crawler Activated. Target: {TARGET_URL}")

    # 1. Setup Headless Chrome
    chrome_options = Options()
    chrome_options.add_argument("--headless") 
    chrome_options.add_argument("--log-level=3") # Silence logs
    
    driver = webdriver.Chrome(options=chrome_options)

    try:
        # 2. Ingest
        driver.get(TARGET_URL)
        time.sleep(1) # Wait for render
        
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')

        # 3. Extract Metadata (The "Intelligence")
        title = soup.title.string if soup.title else "Unknown Asset"
        
        # Extract Meta Tags
        meta_uploader = soup.find("meta", attrs={"name": "uploader"})
        uploader = meta_uploader["content"] if meta_uploader else "Unknown"

        meta_location = soup.find("meta", attrs={"name": "server_location"})
        location = meta_location["content"] if meta_location else "XX"
        
        meta_duration = soup.find("meta", attrs={"name": "duration"})
        duration = int(meta_duration["content"]) if meta_duration else 0

        # 4. Generate Evidence Hash
        html_hash = calculate_hash(page_source)

        print(f"[+] TARGET ACQUIRED: {title}")
        print(f"[+] LOCATION: {location}")
        print(f"[+] DURATION: {duration} mins")
        print(f"[+] EVIDENCE HASH: {html_hash[:10]}...")

        # 5. Build Payload (Matching Backend Expectations)
        payload = {
            "scraped_data": {
                "page_title": title,
                "url": TARGET_URL,
                "uploader_name": uploader,
                "server_location_code": location,
                "video_duration_minutes": duration, # Critical for Integrity Check
                "html_hash": html_hash
            }
        }

        # 6. Send Report
        response = requests.post(API_ENDPOINT, json=payload)
        
        if response.status_code == 201:
            print(f"[+] SUCCESS: Evidence Package Uploaded (HTTP 201)")
        else:
            print(f"[-] FAILED: Backend rejected report. Status: {response.status_code}")
            print(response.text)

    except Exception as e:
        print(f"[-] CRITICAL FAILURE: {e}")
        # Hint: Make sure the mock site is running on port 8080!

    finally:
        driver.quit()

if __name__ == "__main__":
    run_crawler()