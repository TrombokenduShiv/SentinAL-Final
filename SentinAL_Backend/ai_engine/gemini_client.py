import os
import json
import google.genai as genai
from dotenv import load_dotenv
from .prompts import CONTRACT_PARSER_SYSTEM_PROMPT, LEGAL_NOTICE_SYSTEM_PROMPT



# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# Initialize the Client and Model
client = genai.Client(api_key=api_key)
MODEL_NAME = 'gemini-pro'



def parse_contract_pdf(pdf_text_content):
    """
    Sends raw text from a PDF to Gemini to extract structured JSON.
    """
    try:
        # Construct the Prompt
        full_prompt = f"{CONTRACT_PARSER_SYSTEM_PROMPT}\n\nCONTRACT TEXT:\n{pdf_text_content}"
        response = client.models.generate_content(model=MODEL_NAME, contents=full_prompt)
        raw_text = response.text if hasattr(response, 'text') else response.candidates[0].text

        # Clean up Markdown code blocks if Gemini adds them
        if "```json" in raw_text:
            raw_text = raw_text.replace("```json", "").replace("```", "")
        return json.loads(raw_text)
    except Exception as e:
        import traceback
        print(f"Error parsing contract: {e}")
        traceback.print_exc()
        return None

def draft_legal_notice(violation_details):
    """
    Generates a Cease & Desist letter based on violation data.
    """
    try:
        # Construct the Prompt
        details_str = json.dumps(violation_details, indent=2)
        full_prompt = f"{LEGAL_NOTICE_SYSTEM_PROMPT}\n\nVIOLATION DETAILS:\n{details_str}"
        response = client.models.generate_content(model=MODEL_NAME, contents=full_prompt)
        if hasattr(response, 'text'):
            return response.text
        elif hasattr(response, 'candidates') and response.candidates:
            return response.candidates[0].text
        else:
            print("Gemini API returned no usable text or candidates.")
            print(f"Raw response: {response}")
            return "NOTICE GENERATION FAILED due to AI Error."
    except Exception as e:
        import traceback
        print(f"Error drafting notice: {e}")
        traceback.print_exc()
        return "NOTICE GENERATION FAILED due to AI Error."