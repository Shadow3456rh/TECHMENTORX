# 🚀 Real-Time AI Streaming Integration Guide
### Ollama Mistral:7b + Flask + Next.js

This guide explains how to integrate real-time LLM streaming from Ollama's mistral:7b model into your application.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [How It Works](#how-it-works)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)
7. [Advanced Features](#advanced-features)

---

## ✅ Prerequisites

### 1. Install Ollama
```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Or download from: https://ollama.com/download
```

### 2. Pull Mistral:7b Model
```bash
ollama pull mistral:7b
```

### 3. Verify Installation
```bash
ollama list
# Should show mistral:7b in the list
```

### 4. Test Ollama
```bash
ollama run mistral:7b "Hello, how are you?"
# Should return a response
```

---

## 🔧 Backend Setup

### Location
The backend is already updated at:
```
/Users/yash/Documents/GitHub/TECHMENTORX/scanners/backend.py
```

### Key Changes Made

#### 1. **Updated `/summarize` Endpoint** (Lines 276-350)
```python
@app.route('/summarize', methods=['POST'])
def summarize_report():
    """
    Real-time streaming endpoint that sends LLM tokens
    as they're generated from Ollama mistral:7b
    """
    # ... (see backend.py for full code)
```

#### 2. **Streaming Mechanism**
- Uses Python generator function `generate()`
- Subprocess pipes output from `ollama run mistral:7b`
- Yields chunks in SSE (Server-Sent Events) format
- Response headers set for streaming:
  - `Content-Type: text/event-stream`
  - `Cache-Control: no-cache`

#### 3. **How Backend Streaming Works**
```
Flask Request → generate() → subprocess.Popen(['ollama', 'run', 'mistral:7b'])
                                        ↓
                            Read stdout line-by-line
                                        ↓
                            yield f"data: {line}\n\n"   [SSE format]
                                        ↓
                            Stream to client instantly
```

### Running the Backend
```bash
cd /Users/yash/Documents/GitHub/TECHMENTORX/scanners

# Run the Flask server
python3 backend.py
```

**Backend will start on:** `http://localhost:5001`

---

## 🎨 Frontend Setup

### Location
New files created:
```
/Users/yash/Documents/GitHub/TECHMENTORX/dashboard/frontend/src/components/AiSummarizer.js
/Users/yash/Documents/GitHub/TECHMENTORX/dashboard/frontend/src/app/ai-summarizer/page.js
```

### Key Features

#### 1. **AiSummarizer Component**
- Real-time streaming via Fetch API
- ReadableStream processing
- Auto-scrolling summary view
- Beautiful glassmorphism UI
- Error handling

#### 2. **Streaming Mechanism**
```javascript
const reader = response.body.getReader();
const decoder = new TextDecoder('utf-8');

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  // Parse SSE format: "data: <content>\n\n"
  // Update state with new tokens
  setSummary(prev => prev + content);
}
```

#### 3. **How Frontend Streaming Works**
```
User Input → POST /summarize → Fetch API → ReadableStream
                                                ↓
                                    Split by SSE format
                                                ↓
                                    Extract "data: " lines
                                                ↓
                            Update state → Re-render → Show token
```

### Running the Frontend
```bash
cd /Users/yash/Documents/GitHub/TECHMENTORX/dashboard/frontend

# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

**Frontend will start on:** `http://localhost:3000`

### Access the AI Summarizer
```
http://localhost:3000/ai-summarizer
```

---

## 🔄 How It Works (End-to-End)

### Complete Flow Diagram
```
┌─────────────────┐
│   Next.js UI    │
│  (User enters   │
│   report text)  │
└────────┬────────┘
         │ 1. POST /summarize
         │    { report: "..." }
         ↓
┌─────────────────────┐
│   Flask Backend     │
│  - Validates input  │
│  - Checks Ollama    │
└────────┬────────────┘
         │ 2. Start subprocess
         │    ollama run mistral:7b
         ↓
┌─────────────────────────┐
│   Ollama Mistral:7b     │
│  - Processes prompt     │
│  - Generates tokens     │
│  - Outputs to stdout    │
└────────┬────────────────┘
         │ 3. Stream output
         │    Line by line
         ↓
┌─────────────────────────┐
│   Flask Generator       │
│  - Reads stdout         │
│  - Formats as SSE       │
│  - yield "data: ...\n\n"│
└────────┬────────────────┘
         │ 4. HTTP Streaming
         │    text/event-stream
         ↓
┌─────────────────────────┐
│   Next.js Frontend      │
│  - ReadableStream       │
│  - Parse SSE chunks     │
│  - Update state         │
│  - Re-render UI         │
└─────────────────────────┘
         │ 5. Display
         ↓
    User sees tokens
    appearing in real-time!
```

### Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| LLM | Ollama Mistral:7b | Generate AI summaries |
| Backend | Flask + subprocess | Bridge between Ollama and web |
| Streaming | SSE (Server-Sent Events) | Real-time data transfer |
| Frontend | Next.js + Fetch API | Display streaming responses |
| UI | Tailwind CSS | Beautiful glassmorphism design |

---

## 🧪 Testing

### 1. Test Backend Streaming (via curl)
```bash
# Test the streaming endpoint directly
curl -X POST http://localhost:5001/summarize \
  -H "Content-Type: application/json" \
  -d '{"report": "Test report with port 80 open and SSH vulnerability"}' \
  -N  # Important: -N disables output buffering
```

You should see tokens streaming in real-time!

### 2. Test with Sample Report
1. Open `http://localhost:3000/ai-summarizer`
2. Click **"Load Sample"** button
3. Click **"🚀 Analyze with AI"**
4. Watch tokens appear in real-time on the right panel

### 3. Test with Custom Report
Paste any network security scan report and click analyze.

---

## 🐛 Troubleshooting

### Issue 1: "Ollama is not installed"
**Solution:**
```bash
# Check if ollama is in PATH
which ollama

# If not found, install it
curl -fsSL https://ollama.com/install.sh | sh

# Add to PATH if needed
export PATH=$PATH:/usr/local/bin
```

### Issue 2: "Model not found: mistral:7b"
**Solution:**
```bash
# Pull the model
ollama pull mistral:7b

# Verify it's downloaded
ollama list
```

### Issue 3: Backend CORS errors
**Solution:**
The backend already includes CORS headers (lines 34-39):
```python
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    # ...
```

If still having issues, check the browser console for specific errors.

### Issue 4: Streaming not working / Text appears all at once
**Possible causes:**
1. **nginx buffering** (if behind proxy)
   - Solution: Header `X-Accel-Buffering: no` is already set
2. **Browser caching**
   - Solution: Header `Cache-Control: no-cache` is already set
3. **Reading entire stream at once**
   - Check frontend code is using `reader.read()` in loop, not `response.text()`

### Issue 5: Frontend shows "Failed to connect"
**Check:**
```bash
# 1. Is backend running?
curl http://localhost:5001/summarize

# 2. Is the port correct in frontend?
# Check AiSummarizer.js line 68:
# const response = await fetch('http://localhost:5001/summarize', ...

# 3. Any firewall blocking port 5001?
```

### Issue 6: Ollama is slow or hangs
**Solutions:**
1. **Check system resources** (Mistral:7b needs ~8GB RAM)
2. **Use a smaller model for testing:**
   ```bash
   ollama pull mistral:7b-instruct-q4_0  # Quantized version, faster
   ```
3. **Increase timeout** in backend if needed

---

## 🚀 Advanced Features

### 1. Add Progress Indicator
**Backend modification:**
```python
def generate():
    yield f"data: [STARTING]\n\n"  # Send start signal
    # ... existing code ...
    yield f"data: [COMPLETE]\n\n"  # Send completion signal
```

**Frontend modification:**
```javascript
if (content === '[STARTING]') {
  // Show "AI is thinking..." message
} else if (content === '[COMPLETE]') {
  // Show completion animation
}
```

### 2. Add Token Counter
```javascript
const [tokenCount, setTokenCount] = useState(0);

// In streaming loop:
setTokenCount(prev => prev + 1);
```

### 3. Add Typing Effect
Instead of instant display, simulate typing:
```javascript
const [displayedText, setDisplayedText] = useState('');
const fullTextRef = useRef('');

// When receiving chunk:
fullTextRef.current += content;

// Typing animation
useEffect(() => {
  let index = 0;
  const interval = setInterval(() => {
    if (index < fullTextRef.current.length) {
      setDisplayedText(fullTextRef.current.substring(0, index + 1));
      index++;
    }
  }, 20);  // 20ms per character
  return () => clearInterval(interval);
}, [summary]);
```

### 4. Add Multiple Model Support
**Backend:**
```python
model = data.get('model', 'mistral:7b')  # Allow client to specify model
process = subprocess.Popen(['ollama', 'run', model], ...)
```

**Frontend:**
```javascript
<select onChange={(e) => setSelectedModel(e.target.value)}>
  <option value="mistral:7b">Mistral 7B</option>
  <option value="llama3.1:8b">Llama 3.1 8B</option>
  <option value="codellama:7b">CodeLlama 7B</option>
</select>
```

### 5. Save Summaries to Database
Add to backend after streaming completes:
```python
# After process completes
from datetime import datetime
import json

summary_data = {
    'timestamp': datetime.now().isoformat(),
    'report': report_content,
    'summary': full_summary,
    'model': 'mistral:7b'
}

# Save to file or database
with open('summaries.json', 'a') as f:
    f.write(json.dumps(summary_data) + '\n')
```

### 6. Add Streaming to Existing Dashboard Pages
Import the component anywhere:
```javascript
import AiSummarizer from '@/components/AiSummarizer';

// In your dashboard page:
<AiSummarizer />
```

Or create a modal/dialog version for inline use.

---

## 📚 Additional Resources

### Documentation
- [Ollama Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Flask Streaming](https://flask.palletsprojects.com/en/2.3.x/patterns/streaming/)
- [Fetch API Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)

### Alternative Approaches
1. **WebSocket** instead of SSE (bidirectional)
2. **Ollama API** instead of subprocess (more control)
3. **LangChain** for more complex chains
4. **OpenAI-compatible API** (Ollama supports this)

### Performance Tips
1. **Model quantization**: Use Q4 or Q5 versions for faster inference
2. **Batch processing**: Process multiple reports in parallel
3. **Caching**: Cache summaries for identical reports
4. **GPU acceleration**: Use NVIDIA GPU if available

---

## ✅ Quick Start Checklist

- [ ] Install Ollama
- [ ] Pull mistral:7b model
- [ ] Test Ollama in terminal
- [ ] Backend running on port 5001
- [ ] Frontend running on port 3000
- [ ] Open http://localhost:3000/ai-summarizer
- [ ] Click "Load Sample" and test
- [ ] See real-time streaming! 🎉

---

## 💡 Integration into Existing Pages

### Option 1: Add to Dashboard Scan Page
```javascript
// In /dashboard/scan/page.js
import AiSummarizer from '@/components/AiSummarizer';

// Add button to analyze current scan
<button onClick={() => {
  // Pass scan results to AiSummarizer
}}>
  Analyze with AI
</button>
```

### Option 2: Create AI Analysis Tab
```javascript
// Add new tab in dashboard
<Tab label="AI Analysis">
  <AiSummarizer />
</Tab>
```

### Option 3: Inline Mini Version
Create a compact version:
```javascript
// CompactAiSummarizer.js
export default function CompactAiSummarizer({ reportText }) {
  // Similar logic but smaller UI
  return <div className="compact-analyzer">...</div>;
}
```

---

## 🎯 Next Steps

1. **Test the integration** with both sample and real reports
2. **Customize the prompt** in backend.py for better summaries
3. **Add authentication** if needed (JWT tokens)
4. **Monitor performance** and optimize model selection
5. **Add error recovery** for network issues
6. **Implement caching** for frequently analyzed reports
7. **Add export functionality** (PDF, JSON, etc.)

---

## 🤝 Support

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Verify all prerequisites are met
3. Check browser console for errors
4. Check Flask terminal for backend errors
5. Test Ollama independently

---

**Happy Streaming! 🚀**
