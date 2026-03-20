from google import genai
from google.genai import types
from pydantic import BaseModel, ValidationError
from typing import Optional, List
from core.config import settings
from schemas.complaint import ComplaintAIResponse
import os

class GeminiService:
    def __init__(self):
        # The SDK automatically uses os.environ["GOOGLE_API_KEY"] if API key is not passed.
        # We initialized with settings value.
        api_key = os.environ.get("GOOGLE_API_KEY") or settings.GOOGLE_API_KEY
        if not api_key:
            # We raise a graceful error or warning for now
            print("WARNING: GOOGLE_API_KEY is not set.")
        self.client = genai.Client(api_key=api_key)
        # Using gemini-2.5-flash as default for general multimodal extraction
        self.model_name = "gemini-2.5-flash"

    def process_complaint(self, text_input: str, image_bytes: Optional[bytes] = None, mime_type: Optional[str] = "image/jpeg") -> ComplaintAIResponse:
        """
        Processes a complaint with optional image data and returns structured JSON output.
        """
        contents = []
        contents.append(f"User Complaint: {text_input}")

        if image_bytes:
            contents.append(
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=mime_type,
                )
            )

        prompt = (
            "Analyze the above input (text and/or image) representing a civic complaint. "
            "Identify the category of the issue (e.g., road_damage, sanitation, water, lighting, general). "
            "Assess the severity level (low, medium, high). "
            "Extract a concise description summary and verify if the request is highly accurate/actionable."
        )
        contents.append(prompt)

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=contents,
                config=types.GenerateContentConfig(
                    # We strictly enforce response_schema output for reliable FastAPI validation.
                    response_mime_type="application/json",
                    response_schema=ComplaintAIResponse,
                ),
            )

            # The response.text guarantees adherence to the Pydantic model structure
            if response.text:
                return ComplaintAIResponse.model_validate_json(response.text)
            else:
                raise ValueError("No response content generated from Gemini.")

        except Exception as e:
            # Proper error handling as per Engineering Principles
            print(f"Error calling Gemini API: {e}")
            raise e

gemini_service = GeminiService()
