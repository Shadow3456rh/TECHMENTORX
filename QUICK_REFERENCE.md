# 🚀 Quick Reference: Ollama Streaming Integration

## One-Time Setup
```bash
# 1. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull Mistral model
ollama pull mistral:7b

# 3. Verify
ollama list
```

## Starting the Application

### Terminal 1: Backend (Flask)
```bash
cd /Users/yash/Documents/GitHub/TECHMENTORX/scanners
python3 backend.py
# ✅ Backend running on http://localhost:5001
```

### Terminal 2: Frontend (Next.js)
```bash
cd /Users/yash/Documents/GitHub/TECHMENTORX/dashboard/frontend
npm run dev
# ✅ Frontend running on http://localhost:3000
```

### Access
Open: **http://localhost:3000/ai-summarizer**

---

## Quick Test
```bash
# Test backend streaming directly
curl -X POST http://localhost:5001/summarize \
  -H "Content-Type: application/json" \
  -d '{"report": "Port 80 open. SSH vulnerability detected."}' \
  -N
```

---

## Key Files

### Backend
- `/Users/yash/Documents/GitHub/TECHMENTORX/scanners/backend.py`
  - Line 276-350: `/summarize` endpoint with streaming

### Frontend  
- `/Users/yash/Documents/GitHub/TECHMENTORX/dashboard/frontend/src/components/AiSummarizer.js`
  - Main component with streaming logic
- `/Users/yash/Documents/GitHub/TECHMENTORX/dashboard/frontend/src/app/ai-summarizer/page.js`
  - Page route

---

## How It Works

```
User Input → POST /summarize → Flask → Ollama mistral:7b
                                           ↓
                                    Generate tokens
                                           ↓
Flask Generator → yield "data: ...\n\n" → SSE Stream
                                           ↓
                            Next.js ReadableStream
                                           ↓
                                Display in Real-Time ✨
```

---

## Architecture Components

| Component | Technology | Port | Purpose |
|-----------|-----------|------|---------|
| Frontend | Next.js 14 | 3000 | UI & Streaming Display |
| Backend | Flask | 5001 | API & Ollama Bridge |
| LLM | Ollama Mistral:7b | - | AI Analysis |
| Protocol | SSE | - | Real-time Streaming |

---

## Code Snippets

### Backend: Streaming Generator
```python
def generate():
    process = subprocess.Popen(
        ['ollama', 'run', 'mistral:7b'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        text=True,
        bufsize=1
    )
    process.stdin.write(prompt)
    process.stdin.close()
    
    for line in iter(process.stdout.readline, ''):
        if line:
            yield f"data: {line}\n\n"  # SSE format
```

### Frontend: Receiving Stream
```javascript
const reader = response.body.getReader();
const decoder = new TextDecoder('utf-8');

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  // Parse SSE and update state
  setSummary(prev => prev + content);
}
```

---

## Integration Options

### Add to Existing Page
```javascript
import AiSummarizer from '@/components/AiSummarizer';

// In your component
<AiSummarizer />
```

### Pass Report Programmatically
Modify `AiSummarizer.js`:
```javascript
export default function AiSummarizer({ initialReport }) {
  const [reportText, setReportText] = useState(initialReport || '');
  // ... rest of code
}
```

### Trigger from Dashboard
```javascript
// In dashboard scan page
<button onClick={() => {
  router.push(`/ai-summarizer?report=${encodeURIComponent(scanData)}`);
}}>
  Analyze with AI
</button>
```

---

## Troubleshooting Quick Fixes

### "Ollama not found"
```bash
export PATH=$PATH:/usr/local/bin
```

### "Model not found"
```bash
ollama pull mistral:7b
```

### "CORS error"
Already handled in backend (lines 34-39)

### "No streaming / text appears all at once"
Check:
- Browser supports ReadableStream (Chrome, Firefox, Safari 14.1+)
- No proxy buffering
- Using `-N` flag in curl for testing

---

## Advanced: Change Model

### Backend (backend.py, line 319)
```python
process = subprocess.Popen(
    ['ollama', 'run', 'llama3.1:8b'],  # Change model here
    # ... rest
)
```

### Available Models
```bash
ollama list  # See all pulled models
ollama pull llama3.1:8b
ollama pull codellama:7b
ollama pull phi:2.7b  # Faster, less accurate
```

---

## Performance Tips

1. **Faster Model**: Use quantized versions
   ```bash
   ollama pull mistral:7b-instruct-q4_0
   ```

2. **GPU**: Enable if available (automatic with Ollama)

3. **Caching**: Store summaries to avoid re-processing

4. **Parallel**: Process multiple reports concurrently

---

## Next Steps

- [ ] Test with sample report in UI
- [ ] Test with real scan data
- [ ] Integrate into dashboard workflow
- [ ] Add export functionality
- [ ] Customize AI prompts
- [ ] Add authentication if needed

---

**Full Guide**: See `INTEGRATION_GUIDE.md`
