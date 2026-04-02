import requests
import json
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

# Test the exact same way the frontend does
def test_frontend_upload():
    # Create a proper test PDF
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.drawString(100, 750, "Test Academic Paper")
    p.drawString(100, 730, "Author: Test Author")
    p.drawString(100, 710, "Abstract: This is a test abstract for the academic paper.")
    p.drawString(100, 690, "Introduction: This is the introduction section.")
    p.drawString(100, 670, "Methodology: We used a simple approach to test the system.")
    p.drawString(100, 650, "Results: The system works as expected.")
    p.drawString(100, 630, "Conclusion: This concludes our test paper.")
    p.save()
    
    pdf_content = buffer.getvalue()
    buffer.close()
    
    # Test with the same headers and format as frontend
    files = {'file': ('test.pdf', pdf_content, 'application/pdf')}
    
    try:
        response = requests.post(
            'http://localhost:8000/api/papers/', 
            files=files,
            headers={
                'Origin': 'http://localhost:5176',
                'Referer': 'http://localhost:5176/'
            }
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body: {response.text}")
        
        # Test CORS preflight
        print("\n--- Testing CORS Preflight ---")
        preflight_response = requests.options(
            'http://localhost:8000/api/papers/',
            headers={
                'Origin': 'http://localhost:5176',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
        )
        
        print(f"Preflight Status: {preflight_response.status_code}")
        print(f"Preflight Headers: {dict(preflight_response.headers)}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_frontend_upload()
