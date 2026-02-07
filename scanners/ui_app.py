from flask import Flask, render_template_string

app = Flask(__name__)

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEC-OPS TERMINAL V2.2 // ESTIMATOR</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --bg-color: #0d0d0d;
            --panel-bg: #1a1a1a;
            --text-color: #00ff00;
            --dim-text: #448844;
            --border-color: #333;
            --accent: #00ff00;
            --danger: #ff5555;
            --warning: #ffb86c;
            --font-main: 'Courier New', Courier, monospace;
        }
        
        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: var(--font-main);
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            height: 100vh;
            box-sizing: border-box;
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: var(--dim-text); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--accent); }

        h1 {
            text-align: center;
            border-bottom: 1px solid var(--accent);
            padding-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-top: 0;
            text-shadow: 0 0 10px var(--accent);
            font-size: 1.5rem;
        }

        .main-layout {
            display: flex;
            flex: 1;
            gap: 20px;
            overflow: hidden; /* Prevent full page scroll */
        }

        /* LEFT PANEL: CONTROLS */
        .controls {
            flex: 0 0 300px;
            background: var(--panel-bg);
            padding: 15px;
            border: 1px solid var(--border-color);
            overflow-y: auto;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        /* MIDDLE PANEL: TERMINAL */
        .terminal-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
            min-width: 0; /* Flexbox fix */
        }

        .terminal {
            flex: 1;
            background: black;
            border: 1px solid var(--accent);
            padding: 15px;
            overflow-y: auto;
            white-space: pre-wrap;
            font-size: 13px;
            line-height: 1.4;
            color: #ccc;
            box-shadow: inset 0 0 20px rgba(0, 255, 0, 0.1);
            position: relative;
        }

        /* INPUT BAR STYLING */
        .input-bar {
            display: flex;
            align-items: center;
            background: #111;
            border: 1px solid var(--border-color);
            padding: 5px;
            border-radius: 4px;
        }
        .prompt-symbol {
            color: var(--accent);
            font-weight: bold;
            margin-right: 10px;
            padding-left: 5px;
        }
        #interactive-input {
            flex: 1;
            background: transparent;
            border: none;
            color: #fff;
            font-family: var(--font-main);
            font-size: 14px;
            outline: none;
        }
        #send-input-btn {
            background: var(--dim-text);
            color: #000;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            font-weight: bold;
        }
        #send-input-btn:hover {
            background: var(--accent);
        }

        /* RIGHT PANEL: VISUALIZATION (Initially hidden or small) */
        .dashboard {
            flex: 0 0 320px;
            background: var(--panel-bg);
            border: 1px solid var(--border-color);
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 20px;
            border-radius: 4px;
        }

        .chart-container {
            background: #000;
            border: 1px solid #333;
            padding: 10px;
            border-radius: 4px;
            min-height: 200px;
        }

        h3 {
            margin: 0 0 10px 0;
            color: #fff;
            border-bottom: 1px solid #444;
            padding-bottom: 5px;
            font-size: 0.9em;
            text-transform: uppercase;
        }

        /* FORM ELEMENTS */
        .input-group label {
            display: block;
            margin-bottom: 5px;
            color: var(--accent);
            font-weight: bold;
            font-size: 0.8rem;
        }

        input[type="text"] {
            width: 100%;
            background: #000;
            border: 1px solid var(--dim-text);
            color: white;
            padding: 8px;
            font-family: var(--font-main);
            box-sizing: border-box;
        }

        .options-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 5px;
        }

        .checkbox-wrapper {
            display: flex;
            align-items: center;
            font-size: 0.8em;
            cursor: pointer;
            color: #aaa;
        }
        .checkbox-wrapper input { margin-right: 8px; accent-color: var(--accent); }
        .checkbox-wrapper:hover { color: #fff; }

        .section-title {
            color: var(--accent);
            font-size: 0.75em;
            margin-top: 10px;
            margin-bottom: 5px;
            text-transform: uppercase;
            font-weight: bold;
            border-bottom: 1px solid #333;
        }

        /* BUTTONS */
        button {
            font-family: var(--font-main);
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.2s;
            border-radius: 2px;
        }

        #run-btn {
            background: var(--accent);
            color: black;
            border: none;
            padding: 12px;
            width: 100%;
            font-weight: bold;
            font-size: 1rem;
            margin-top: auto;
        }
        #run-btn:hover { box-shadow: 0 0 15px var(--accent); }
        #run-btn:disabled { background: #333; color: #555; cursor: not-allowed; box-shadow: none; }

        .btn-small {
            background: transparent;
            border: 1px solid var(--dim-text);
            color: var(--dim-text);
            padding: 4px 8px;
            font-size: 0.7rem;
        }
        .btn-small:hover { border-color: var(--accent); color: var(--accent); }

        .consent-box {
            border: 1px solid var(--danger);
            padding: 8px;
            background: rgba(255, 0, 0, 0.05);
            margin-top: 10px;
        }
        
        /* TIME ESTIMATION BOX */
        .time-estimate {
            background: #222;
            border: 1px solid #444;
            padding: 8px;
            margin-bottom: 10px;
            font-size: 0.8em;
            color: #fff;
            text-align: center;
            border-radius: 3px;
        }
        .time-value {
            color: var(--warning);
            font-weight: bold;
            font-size: 1.1em;
        }

        /* LOADING INDICATOR */
        .loading-bar {
            height: 4px;
            width: 100%;
            background: #333;
            margin-top: 5px;
            position: relative;
            overflow: hidden;
            display: none;
        }
        .loading-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 30%;
            background: var(--accent);
            animation: slide 1.5s infinite ease-in-out;
        }
        @keyframes slide {
            0% { left: -30%; }
            100% { left: 100%; }
        }

        .status-badge {
            display: inline-block;
            padding: 2px 6px;
            background: #333;
            color: #fff;
            border-radius: 3px;
            font-size: 0.7rem;
            margin-right: 5px;
        }
        .status-badge.active { background: var(--accent); color: #000; animation: blink 1s infinite; }
        @keyframes blink { 50% { opacity: 0.5; } }

        /* METRICS */
        .metric-card {
            background: #111;
            padding: 10px;
            border-left: 3px solid var(--dim-text);
            margin-bottom: 5px;
        }
        .metric-value { font-size: 1.5em; color: #fff; }
        .metric-label { font-size: 0.7em; color: #888; text-transform: uppercase; }

    </style>
</head>
<body>
    <h1>SEC-OPS Local Network Auditor v2.2</h1>
    
    <div class="main-layout">
        <!-- LEFT CONTROL PANEL -->
        <div class="controls">
            <div class="input-group">
                <label>TARGET IP</label>
                <input type="text" id="target_ip" value="127.0.0.1">
            </div>
            <div class="input-group">
                <label>TARGET NETWORK</label>
                <input type="text" id="target_network" value="192.168.1.0/24">
            </div>

            <div class="time-estimate">
                ESTIMATED TIME: <span id="time-val" class="time-value">~0 min</span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="section-title" style="border:none; margin:0;">MODULES</span>
                <button class="btn-small" onclick="toggleAll()">TOGGLE ALL</button>
            </div>

            <div class="options-grid" id="options-container">
                <div class="section-title">Reconnaissance</div>
                <label class="checkbox-wrapper"><input type="checkbox" id="host_discovery" data-time="15" checked onchange="updateEstimate()"> Host Discovery</label>
                <label class="checkbox-wrapper"><input type="checkbox" id="os_detect" data-time="30" checked onchange="updateEstimate()"> OS Fingerprint</label>
                <label class="checkbox-wrapper"><input type="checkbox" id="service_detect" data-time="45" checked onchange="updateEstimate()"> Service Detect</label>
                
                <div class="section-title">Network Scan</div>
                <label class="checkbox-wrapper"><input type="checkbox" id="basic_tcp" data-time="30" checked onchange="updateEstimate()"> Basic TCP</label>
                <label class="checkbox-wrapper"><input type="checkbox" id="full_tcp" data-time="600" checked onchange="updateEstimate()"> Full TCP (1-65535)</label>
                <label class="checkbox-wrapper"><input type="checkbox" id="udp_scan" data-time="300" checked onchange="updateEstimate()"> UDP Top 100</label>
                <label class="checkbox-wrapper"><input type="checkbox" id="aggressive" data-time="180" checked onchange="updateEstimate()"> Aggressive (-A)</label>

                <div class="section-title">Web & App</div>
                <label class="checkbox-wrapper"><input type="checkbox" id="nikto" data-time="600" checked onchange="updateEstimate()"> Nikto Scanner</label>
                <label class="checkbox-wrapper"><input type="checkbox" id="web_enum" data-time="60" checked onchange="updateEstimate()"> Web Enumeration</label>
                <label class="checkbox-wrapper"><input type="checkbox" id="ssl_scan" data-time="45" checked onchange="updateEstimate()"> SSL/TLS Audit</label>

                <div class="section-title">Security Audit</div>
                <label class="checkbox-wrapper"><input type="checkbox" id="vuln_scan" data-time="120" checked onchange="updateEstimate()"> Vulcan Scripts</label>
                <label class="checkbox-wrapper"><input type="checkbox" id="auth_checks" data-time="60" checked onchange="updateEstimate()"> Weak Auth</label>
                <label class="checkbox-wrapper"><input type="checkbox" id="priv_esc" data-time="5" checked onchange="updateEstimate()"> Priv Escalation</label>
                <label class="checkbox-wrapper"><input type="checkbox" id="persistence" data-time="5" checked onchange="updateEstimate()"> Persistence</label>
                <label class="checkbox-wrapper"><input type="checkbox" id="dos_check" data-time="30" checked onchange="updateEstimate()"> DoS Exposure</label>
                
                <!-- Added missing controls -->
                <div style="display:none;">
                    <input type="checkbox" id="network_stack" data-time="2" checked onchange="updateEstimate()"> 
                    <input type="checkbox" id="container" data-time="2" checked onchange="updateEstimate()">
                    <input type="checkbox" id="password_policy" data-time="2" checked onchange="updateEstimate()">
                    <input type="checkbox" id="listening_services" data-time="2" checked onchange="updateEstimate()">
                    <input type="checkbox" id="firewall" data-time="20" checked onchange="updateEstimate()">
                </div>
            </div>

            <div class="consent-box">
                <label class="checkbox-wrapper" style="color: var(--danger);">
                    <input type="checkbox" id="user_confirmation"> 
                    AUTHORIZE LOCAL SCAN
                </label>
            </div>

            <button id="run-btn" onclick="startScan()">INITIATE SCAN</button>
        </div>

        <!-- MIDDLE TERMINAL PANEL -->
        <div class="terminal-container">
            <div style="display:flex; justify-content:space-between; align-items:center; background:#111; padding:5px 10px;">
                <div>
                    <span class="status-badge" id="status-badge">IDLE</span>
                    <span id="current-task" style="font-size:0.8em; color:#888;">Ready...</span>
                </div>
                <button class="btn-small" id="download-btn" onclick="downloadReport()" disabled>DOWNLOAD REPORT</button>
            </div>
            
            <div class="terminal" id="terminal-output">
                <span style="color:var(--dim-text)">// SYSTEM READY</span>
                <span style="color:var(--dim-text)">// Connects to local PTY. Inputs are forwarded directly.</span>
            </div>
            
            <div class="loading-bar" id="loading-bar"></div>

            <!-- INPUT BAR -->
            <div class="input-bar">
                <span class="prompt-symbol">>_</span>
                <input type="text" id="interactive-input" placeholder="Type here (e.g. password) then press Enter..." disabled>
                <button id="send-input-btn" onclick="sendInput()" disabled>SEND</button>
            </div>
        </div>

        <!-- RIGHT DASHBOARD PANEL -->
        <div class="dashboard">
            <h3>Live Analytics</h3>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                <div class="metric-card">
                    <div class="metric-value" id="count-ports">0</div>
                    <div class="metric-label">Open Ports</div>
                </div>
                <div class="metric-card" style="border-color: var(--danger)">
                    <div class="metric-value" id="count-vulns">0</div>
                    <div class="metric-label">Vulns</div>
                </div>
            </div>

            <div class="chart-container">
                <canvas id="vulnPieChart"></canvas>
            </div>
            
            <div class="chart-container">
                <canvas id="portBarChart"></canvas>
            </div>
            
            <div style="font-size:0.75em; color:#555; text-align:center; margin-top:auto;">
                SEC-OPS TERMINAL v2.2<br>
                Local Security Validation
            </div>
        </div>
    </div>

    <script>
        // Init Charts
        let pieChart, barChart;
        let globalLogData = "";

        const ctxPie = document.getElementById('vulnPieChart').getContext('2d');
        const ctxBar = document.getElementById('portBarChart').getContext('2d');

        function initCharts() {
            Chart.defaults.color = '#888';
            Chart.defaults.borderColor = '#333';
            
            pieChart = new Chart(ctxPie, {
                type: 'doughnut',
                data: {
                    labels: ['Info', 'Open Ports', 'Warnings', 'Critical'],
                    datasets: [{
                        data: [0, 0, 0, 0],
                        backgroundColor: ['#2196f3', '#4caf50', '#ff9800', '#f44336'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10 } } }
                }
            });

            barChart = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: ['TCP', 'UDP', 'Services', 'Web'],
                    datasets: [{
                        label: 'Detections',
                        data: [0, 0, 0, 0],
                        backgroundColor: '#00ff00',
                        barThickness: 20
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true } },
                    plugins: { legend: { display: false } }
                }
            });
        }

        initCharts();

        function updateEstimate() {
            let totalSeconds = 0;
            const checkboxes = document.querySelectorAll('input[type="checkbox"][data-time]');
            
            checkboxes.forEach(cb => {
                if (cb.checked) {
                    totalSeconds += parseInt(cb.getAttribute('data-time'));
                }
            });

            // Add base overhead
            totalSeconds += 5; 

            let display = "";
            if (totalSeconds < 60) {
                display = "~" + totalSeconds + " sec";
            } else {
                display = "~" + Math.ceil(totalSeconds / 60) + " min";
            }
            
            document.getElementById('time-val').innerText = display;
        }

        // Run once on load
        updateEstimate();

        function toggleAll() {
            const checkboxes = document.querySelectorAll('.options-grid input[type="checkbox"]');
            const allChecked = Array.from(checkboxes).every(c => c.checked);
            checkboxes.forEach(c => c.checked = !allChecked);
            updateEstimate();
        }

        function updateDashboard(textChunk) {
            // Simple RegEx Analytics
            const openPorts = (textChunk.match(/open/gi) || []).length;
            const warnings = (textChunk.match(/warning|danger|filtered/gi) || []).length;
            const vulns = (textChunk.match(/cve-|vulnerable|exploit/gi) || []).length;
            const info = (textChunk.match(/info|discover/gi) || []).length;

            const tcp = (textChunk.match(/tcp/gi) || []).length;
            const udp = (textChunk.match(/udp/gi) || []).length;
            const http = (textChunk.match(/http/gi) || []).length;

            // Increment Metrics
            const currentPorts = parseInt(document.getElementById('count-ports').innerText);
            const currentVulns = parseInt(document.getElementById('count-vulns').innerText);
            
            document.getElementById('count-ports').innerText = currentPorts + openPorts;
            document.getElementById('count-vulns').innerText = currentVulns + vulns;

            // Update Charts
            pieChart.data.datasets[0].data[0] += info;
            pieChart.data.datasets[0].data[1] += openPorts;
            pieChart.data.datasets[0].data[2] += warnings;
            pieChart.data.datasets[0].data[3] += vulns;
            pieChart.update();

            barChart.data.datasets[0].data[0] += tcp;
            barChart.data.datasets[0].data[1] += udp;
            barChart.data.datasets[0].data[2] += (openPorts);
            barChart.data.datasets[0].data[3] += http;
            barChart.update();
        }

        function downloadReport() {
            const blob = new Blob([globalLogData], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `security_report_${new Date().toISOString().slice(0,19)}.txt`;
            a.click();
        }

        const inputField = document.getElementById('interactive-input');
        const inputBtn = document.getElementById('send-input-btn');
        
        inputField.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                sendInput();
            }
        });
        
        async function sendInput() {
            const val = inputField.value;
            if (!val) return;
            
            try {
                await fetch('http://localhost:5001/input', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ input: val })
                });
                inputField.value = ""; 
            } catch (err) {
                console.error("Failed to send input", err);
            }
        }

        async function startScan() {
            const terminal = document.getElementById('terminal-output');
            const runBtn = document.getElementById('run-btn');
            const loadingBar = document.getElementById('loading-bar');
            const statusBadge = document.getElementById('status-badge');
            const currentTask = document.getElementById('current-task');
            
            // Collect Input
            const consent = document.getElementById('user_confirmation').checked;

            if (!consent) {
                alert("ACCESS DENIED: You must authorize this scan.");
                return;
            }

            // Reset Dashboard
            pieChart.data.datasets[0].data = [0, 0, 0, 0];
            pieChart.update();
            barChart.data.datasets[0].data = [0, 0, 0, 0];
            barChart.update();
            document.getElementById('count-ports').innerText = "0";
            document.getElementById('count-vulns').innerText = "0";
            globalLogData = "";

            // UI State: Running
            runBtn.disabled = true;
            terminal.innerHTML = ""; 
            loadingBar.style.display = 'block';
            statusBadge.classList.add('active');
            statusBadge.innerText = "RUNNING";
            statusBadge.style.background = "var(--accent)";
            statusBadge.style.color = "black";
            
            // Enable Input
            inputField.disabled = false;
            inputBtn.disabled = false;
            inputField.focus();

            // Construct Payload
            const options = {};
            // Gather all inputs including hidden ones
            document.querySelectorAll('input[type="checkbox"]').forEach(input => {
                if(input.id !== 'user_confirmation') {
                   options[input.id] = input.checked;
                }
            });

            const payload = {
                target_ip: document.getElementById('target_ip').value,
                target_network: document.getElementById('target_network').value,
                options,
                consent: { user_confirmation: consent },
                local_llm: false 
            };

            try {
                const response = await fetch('http://localhost:5001/run', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error("Backend busy or error");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const text = decoder.decode(value);
                    globalLogData += text;
                    terminal.textContent += text;
                    terminal.scrollTop = terminal.scrollHeight;
                    
                    updateDashboard(text);

                    const execMatch = text.match(/Executing: (.*)/);
                    if (execMatch) {
                        currentTask.innerText = execMatch[1].substring(0, 40) + "...";
                    }
                }
            } catch (err) {
                terminal.textContent += `\\n[!] ERROR: ${err.message}`;
            } finally {
                runBtn.disabled = false;
                loadingBar.style.display = 'none';
                statusBadge.classList.remove('active');
                statusBadge.innerText = "COMPLETE";
                statusBadge.style.background = "#333";
                statusBadge.style.color = "#fff";
                currentTask.innerText = "Scan finished.";
                document.getElementById('download-btn').disabled = false;
                
                inputField.disabled = true;
                inputBtn.disabled = true;
            }
        }
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

if __name__ == '__main__':
    print("UI Server starting on port 5002...")
    app.run(host='0.0.0.0', port=5002)
