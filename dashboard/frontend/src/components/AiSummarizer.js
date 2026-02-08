'use client';

import { useState, useRef } from 'react';

/**
 * 🚀 REAL-TIME AI REPORT SUMMARIZER COMPONENT
 * 
 * This component demonstrates real-time streaming from Ollama mistral:7b model.
 * It connects to the Flask backend's /summarize endpoint and displays the LLM
 * response as it's being generated, token by token.
 * 
 * Key Features:
 * - Real-time streaming via Server-Sent Events (SSE)
 * - Visual feedback during generation
 * - Error handling and loading states
 * - Responsive design with Tailwind CSS
 * - Auto-scroll to show latest content
 * 
 * @component
 */
export default function AiSummarizer() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [reportText, setReportText] = useState(''); // Input report content
  const [summary, setSummary] = useState(''); // Streaming AI response
  const [isStreaming, setIsStreaming] = useState(false); // Loading/streaming state
  const [error, setError] = useState(''); // Error messages
  
  // Ref to track if component is mounted (prevents state updates after unmount)
  const isMountedRef = useRef(true);
  
  // Ref for auto-scrolling to latest content
  const summaryEndRef = useRef(null);

  // ============================================================================
  // CORE STREAMING FUNCTION
  // ============================================================================
  
  /**
   * Handles the streaming request to the backend.
   * Uses the Fetch API with ReadableStream to process chunks in real-time.
   * 
   * Flow:
   * 1. Send POST request to Flask backend with report content
   * 2. Backend starts Ollama mistral:7b process
   * 3. Receive streaming response via SSE format
   * 4. Parse each chunk and update state in real-time
   * 5. Display tokens as they arrive
   */
  const handleStreamSummary = async () => {
    // Validation
    if (!reportText.trim()) {
      setError('Please enter a report to summarize');
      return;
    }

    // Reset states
    setSummary('');
    setError('');
    setIsStreaming(true);

    try {
      // 📡 STEP 1: Send request to Flask backend
      // Make sure this URL matches your backend server
      const response = await fetch('http://localhost:5001/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ report: reportText }),
      });

      // Check if request was successful
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // 📡 STEP 2: Get the readable stream from response
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      // 📡 STEP 3: Read stream chunks in real-time
      while (true) {
        const { done, value } = await reader.read();
        
        // Stream complete
        if (done) {
          setIsStreaming(false);
          break;
        }

        // 📡 STEP 4: Decode and process chunk
        const chunk = decoder.decode(value, { stream: true });
        
        // Parse SSE format: "data: <content>\n\n"
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.substring(6); // Remove "data: " prefix
            
            // Check for errors
            if (content.startsWith('[ERROR]')) {
              setError(content);
              setIsStreaming(false);
              return;
            }
            
            // 📡 STEP 5: Update state with new content
            // This triggers a re-render and displays the new token
            if (isMountedRef.current) {
              setSummary((prev) => prev + content);
              
              // Auto-scroll to bottom to show latest content
              setTimeout(() => {
                summaryEndRef.current?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }
          }
        }
      }
    } catch (err) {
      console.error('Streaming error:', err);
      setError(`Failed to connect to AI service: ${err.message}`);
      setIsStreaming(false);
    }
  };

  // ============================================================================
  // SAMPLE REPORT FOR TESTING
  // ============================================================================
  
  const loadSampleReport = () => {
    const sampleReport = `=== NETWORK SECURITY SCAN REPORT ===

[2024-02-09] Target: 192.168.1.100

PORT SCAN RESULTS:
22/tcp   open  ssh     OpenSSH 7.4
80/tcp   open  http    Apache httpd 2.4.6
3306/tcp open  mysql   MySQL 5.7.32

VULNERABILITIES DETECTED:
- CVE-2021-41773: Path traversal in Apache 2.4.6
- MySQL running with default credentials
- SSH using weak encryption algorithms
- No firewall detected on ports 80, 3306

RECOMMENDATIONS:
1. Update Apache to latest version
2. Change MySQL root password
3. Configure SSH to use strong ciphers only
4. Enable firewall rules`;

    setReportText(sampleReport);
  };

  // ============================================================================
  // RENDER UI
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* ============= HEADER ============= */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🤖 AI Security Report Analyzer
          </h1>
          <p className="text-xl text-gray-300">
            Real-time streaming with Ollama Mistral:7b
          </p>
          <div className="mt-4 inline-block bg-green-500/20 border border-green-500 rounded-full px-6 py-2">
            <span className="text-green-400 font-semibold">
              ⚡ Streaming Enabled
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* ============= LEFT PANEL: INPUT ============= */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                📄 Security Report
              </h2>
              <button
                onClick={loadSampleReport}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-all"
              >
                Load Sample
              </button>
            </div>
            
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Paste your network security scan report here..."
              className="w-full h-96 bg-gray-900/50 text-gray-100 rounded-xl p-4 border border-gray-600 focus:border-blue-500 focus:outline-none font-mono text-sm resize-none"
            />
            
            <button
              onClick={handleStreamSummary}
              disabled={isStreaming || !reportText.trim()}
              className={`w-full mt-4 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                isStreaming
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
              }`}
            >
              {isStreaming ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing Report...
                </span>
              ) : (
                '🚀 Analyze with AI'
              )}
            </button>
          </div>

          {/* ============= RIGHT PANEL: STREAMING OUTPUT ============= */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              ✨ AI Analysis
              {isStreaming && (
                <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-full animate-pulse">
                  Live
                </span>
              )}
            </h2>
            
            {/* Error Display */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-4">
                <p className="text-red-300">{error}</p>
              </div>
            )}
            
            {/* Streaming Summary Display */}
            <div className="h-96 overflow-y-auto bg-gray-900/50 rounded-xl p-4 border border-gray-600">
              {summary ? (
                <div className="text-gray-100 whitespace-pre-wrap leading-relaxed">
                  {summary}
                  {/* Blinking cursor during streaming */}
                  {isStreaming && (
                    <span className="inline-block w-2 h-5 bg-green-400 ml-1 animate-pulse" />
                  )}
                  {/* Auto-scroll anchor */}
                  <div ref={summaryEndRef} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="text-lg">AI analysis will appear here</p>
                    <p className="text-sm mt-2">Streaming response in real-time</p>
                  </div>
                </div>
              )}
            </div>

            {/* Summary Stats */}
            {summary && !isStreaming && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                  <p className="text-blue-300 text-sm">Response Length</p>
                  <p className="text-white text-2xl font-bold">{summary.length}</p>
                </div>
                <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                  <p className="text-green-300 text-sm">Status</p>
                  <p className="text-white text-2xl font-bold">✓ Complete</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============= INFO PANEL ============= */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">📚 How It Works</h3>
          <div className="grid md:grid-cols-3 gap-4 text-gray-300">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-3xl mb-2">1️⃣</div>
              <h4 className="font-bold text-white mb-2">Backend Processing</h4>
              <p className="text-sm">Flask receives report and sends to Ollama mistral:7b via subprocess</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-3xl mb-2">2️⃣</div>
              <h4 className="font-bold text-white mb-2">Real-time Streaming</h4>
              <p className="text-sm">LLM generates tokens and Flask streams them via SSE to frontend</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-3xl mb-2">3️⃣</div>
              <h4 className="font-bold text-white mb-2">Live Display</h4>
              <p className="text-sm">Next.js receives chunks and updates UI in real-time as tokens arrive</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
