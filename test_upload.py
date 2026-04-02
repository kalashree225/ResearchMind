import requests
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

# Create a simple test PDF
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

# Get the PDF content
pdf_content = buffer.getvalue()
buffer.close()

# Test upload
files = {'file': ('test_paper.pdf', pdf_content, 'application/pdf')}
response = requests.post('http://localhost:8000/api/papers/', files=files)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
print(f"Headers: {response.headers}")
