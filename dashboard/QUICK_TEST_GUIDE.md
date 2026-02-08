## 🎯 Quick Test Guide: Real-Time AI Summarization

### Step-by-Step Visual Guide

#### 1. Check Backend is Running
```bash
# Check if backend is running on port 5001
lsof -ti:5001

# If nothing returns, start the backend:
cd /path/to/backend
python3 app.py
```

Expected output:
```
Backend starting on port 5001...
 * Running on http://0.0.0.0:5001
```

---

#### 2. Verify Ollama is Ready
```bash
# Check Ollama installation
ollama --version

# Check if mistral:7b is installed
ollama list | grep mistral
```

Expected output:
```
ollama version is 0.x.x

mistral:7b    latest    1.5 GB    2 weeks ago
```

If not installed:
```bash
ollama pull mistral:7b
```

---

#### 3. Open Frontend
Navigate to: **http://localhost:3000/dashboard/scan**

Screenshot Location: You should see:
- Left Panel: "TARGET IP" and scan options
- Middle Panel: Terminal output area
- Right Panel: Live analytics

---

#### 4. Run a Scan

**Steps:**
1. Set Target IP: `127.0.0.1` (or your preferred target)
2. Check the checkbox: ✅ **AUTHORIZE LOCAL SCAN**
3. Click: **INITIATE SCAN**

**What to Expect:**
- Terminal shows green text appearing in real-time
- "STATUS" badge shows "RUNNING" (green, blinking)
- Charts on right update as data comes in
- After completion, "VIEW REPORT" button appears

---

#### 5. Test Real-Time Summarization

**Steps:**
1. Click: **VIEW REPORT** button
2. In the report overlay, verify dropdown shows: **Local LLM**
3. Click: **Summarize** button
4. **OBSERVE THE MAGIC** ✨

**Expected Real-Time Behavior:**

```
[Time 0s] - Button shows "Analyzing..."
          - "AI Executive Summary" card shows:
            "Generating security insights from scan data..."

[Time 1-3s] - First words appear:
            "Based on the"

[Time 3-5s] - More words stream in:
            "Based on the network security scan"

[Time 5-10s] - Complete sentences appear line-by-line:
            "Based on the network security scan
            conducted on 127.0.0.1, here are
            the critical findings:"

[Time 10-30s] - Full analysis streams in real-time,
              appearing word-by-word or line-by-line

[Time 30s+] - Streaming completes
            - Button changes back to "Summarize"
            - Complete summary visible
            - Saved to Firestore
```

---

### ✅ Success Indicators

| Indicator | What You Should See |
|-----------|---------------------|
| **Immediate Response** | "Analyzing..." appears within 1 second |
| **Streaming Text** | Words appear **gradually**, not all at once |
| **Smooth Animation** | Text flows like ChatGPT typing effect |
| **No Freezing** | UI remains responsive during streaming |
| **Console Logs** | ✅ `Report saved to Firestore` (no errors) |

---

### ❌ Failure Indicators & Fixes

#### Problem: All text appears at once (no streaming)
**Cause:** Frontend receiving complete response instead of stream  
**Fix:** Clear browser cache and hard reload (Cmd+Shift+R / Ctrl+Shift+F5)

#### Problem: "Analysis Failed: Failed to fetch"
**Cause:** Backend not running  
**Fix:** Start backend on port 5001

#### Problem: "Ollama is not installed"
**Cause:** Ollama not in PATH or not installed  
**Fix:**
```bash
brew install ollama  # Mac
ollama pull mistral:7b
```

#### Problem: Button stuck on "Analyzing..."
**Cause:** Ollama process hung  
**Fix:**
```bash
pkill ollama  # Kill hung process
ollama serve  # Restart Ollama
```

#### Problem: Error in console: "CORS policy"
**Cause:** Backend CORS not configured  
**Fix:** Verify `@app.after_request` decorator is present in backend

---

### 🔍 DevTools Debugging

**Open Browser DevTools (F12):**

#### Network Tab:
1. Click "Summarize"
2. Find `/summarize` request
3. Check **Type** column: Should show `eventsource` or `xhr`
4. Click on request → "Response" tab
5. You should see:
   ```
   data: Based
   data:  on
   data:  the
   ...
   ```

#### Console Tab:
**Expected Logs:**
```
✅ Report saved to Firestore
```

**Bad Logs (Indicates Issues):**
```
❌ Error saving report: ...
AI Summary failed: ...
```

---

### 📹 Recording a Test

To verify streaming works:

```bash
# Terminal 1: Start backend with verbose logging
cd /path/to/backend
python3 app.py

# Terminal 2: Watch frontend logs
cd /Users/yash/Documents/GitHub/TECHMENTORX/dashboard/frontend
npm run dev
```

Then:
1. Open browser DevTools Console
2. Start screen recording (QuickTime / OBS)
3. Click "Summarize"
4. Watch text appear word-by-word
5. Stop recording when complete

**Share recording if streaming doesn't work for debugging**

---

### 🎬 Expected Video Behavior

**Timeline:**
```
00:00 - Click "Summarize" button
00:01 - Button text changes to "Analyzing..."
00:02 - First word "Based" appears
00:03 - "Based on" appears
00:04 - "Based on the" appears
00:05 - "Based on the network" appears
...
00:30 - Complete summary visible
00:31 - Button changes back to "Summarize"
```

**If you see this behavior = ✅ WORKING CORRECTLY**

---

### 🚀 Quick CLI Test (No UI Needed)

Test backend directly:
```bash
# Test streaming endpoint
curl -N -X POST http://localhost:5001/summarize \
  -H "Content-Type: application/json" \
  -d '{"report":"Port 80 open, Port 443 open, Port 22 open"}' \
  2>&1 | grep "data:"

# Expected: Lines appearing one by one:
# data: Based on
# data:  the network
# data:  scan...
```

If you see `data:` lines appearing **gradually** (not instantly), backend is working!

---

### 📊 Performance Benchmarks

**Good Performance:**
- First token: < 3 seconds
- Streaming speed: 50-100 tokens/sec
- Total time: 20-60 seconds (depending on report size)
- No UI freezing

**Poor Performance (Needs Investigation):**
- First token: > 10 seconds → Ollama startup issue
- Text appears in large chunks → Buffering issue
- Total time: > 2 minutes → Model too large, switch to smaller model

---

### 🎯 Final Checklist

Before reporting issues, verify:

- [ ] Backend running on port 5001
- [ ] Frontend running on port 3000
- [ ] Ollama installed: `ollama --version` works
- [ ] Model downloaded: `ollama list | grep mistral` shows result
- [ ] CORS headers in backend code
- [ ] Browser cache cleared
- [ ] DevTools Network tab shows `eventsource` type
- [ ] No console errors in browser
- [ ] Code changes saved and frontend reloaded

---

**Test Date:** ___________  
**Result:** ✅ Working / ❌ Not Working  
**Issues Found:** ___________________________________  
**Screenshots:** ___________________________________

---

## 📞 Getting Help

If streaming still doesn't work after following this guide:

1. **Check Backend Logs:** Look for errors in Flask terminal
2. **Check Frontend Console:** Open DevTools → Console tab
3. **Check Network Tab:** Verify SSE format in Response
4. **Try CLI Test:** Use `curl` command above to isolate frontend vs backend issue

**Common Root Causes (90% of issues):**
1. Backend not running
2. Ollama not installed
3. Model not downloaded
4. Browser cache not cleared
5. CORS errors
