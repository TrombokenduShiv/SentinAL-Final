import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from .prompts import CONTRACT_PARSER_SYSTEM_PROMPT, LEGAL_NOTICE_SYSTEM_PROMPT

# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# --- THE SAFETY NET: Hardcoded Legal Template ---
FALLBACK_NOTICE_TEMPLATE = """
OFFICIAL DMCA CEASE & DESIST NOTICE
--------------------------------------------------
DATE: {date}
TO: Administrator of {url}
FROM: SentinAL Enforcement (On behalf of Rights Holder)

RE: UNAUTHORIZED DISTRIBUTION OF COPYRIGHTED CONTENT - "{asset}"

To Whom It May Concern,

We are the authorized enforcement agents for the copyright holder of the motion picture "{asset}".
It has come to our attention that your website/server is illegally hosting, distributing, or facilitating the unauthorized streaming of this content in violation of international copyright laws.

VIOLATION DETAILS:
- Asset: {asset}
- Detected URL: {url}
- Server Location: {location}
- Evidence Hash: {evidence_hash}
- Violation Type: {breach_type}

This usage constitutes a serious breach of our client's exclusive rights. 
We hereby demand that you expeditiously remove or disable access to the material claimed to be infringing.

Failure to act immediately will result in further legal action, including but not limited to server takedowns and ISP blacklisting.

This notice is generated automatically by SentinAL and is court-admissible evidence.

Signed,
SentinAL Enforcement Engine
"""

if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None
    print("[-] WARNING: No GEMINI_API_KEY found. Running in Offline Fallback Mode.")

def parse_contract_pdf(pdf_text_content):
    if not model:
        return None
    try:
        full_prompt = f"{CONTRACT_PARSER_SYSTEM_PROMPT}\n\nCONTRACT TEXT:\n{pdf_text_content}"
        response = model.generate_content(full_prompt)
        raw_text = response.text.replace("```json", "").replace("```", "")
        return json.loads(raw_text)
    except Exception as e:
        print(f"Error parsing contract: {e}")
        return None

def draft_legal_notice(violation_details):
    """
    Tries to use AI. If it fails, uses the Hardcoded Template (The "Distraction").
    """
    try:
        if not model:
            raise Exception("No API Key configured")

        # 1. Try Live AI Generation
        details_str = json.dumps(violation_details, indent=2)
        full_prompt = f"{LEGAL_NOTICE_SYSTEM_PROMPT}\n\nVIOLATION DETAILS:\n{details_str}"
        response = model.generate_content(full_prompt)
        return response.text

    except Exception as e:
        # 2. THE FALLBACK (Saved the Demo)
        print(f"[!] AI Failed ({e}). Switching to Fallback Template.")
        
        # Fill in the fallback template with real data
        return FALLBACK_NOTICE_TEMPLATE.format(
            date=violation_details.get('timestamp', 'Unknown Date'),
            url=violation_details.get('url', 'Unknown URL'),
            asset=violation_details.get('asset', 'Unknown Asset'),
            location=violation_details.get('location', 'Unknown'),
            evidence_hash=violation_details.get('evidence_hash', 'N/A'),
            breach_type=violation_details.get('breach_type', 'General Infringement')
        )
