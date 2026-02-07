"use client";
import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';

export default function SecOpsTerminal() {
    // State
    const [targetIp, setTargetIp] = useState("127.0.0.1");
    const [targetNetwork, setTargetNetwork] = useState("192.168.1.0/24");
    const [estimatedTime, setEstimatedTime] = useState("~0 min");
    const [consent, setConsent] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [status, setStatus] = useState("IDLE");
    const [currentTask, setCurrentTask] = useState("Ready...");
    const [terminalOutput, setTerminalOutput] = useState([
        "// SYSTEM READY",
        "// Connects to local PTY. Inputs are forwarded directly."
    ]);
    const [interactiveInput, setInteractiveInput] = useState("");
    const [metrics, setMetrics] = useState({
        ports: 0,
        vulns: 0,
        info: 0,
        warnings: 0,
        tcp: 0,
        udp: 0,
        http: 0,
    });

    // Checkbox State (using a Map or Object to track checked state)
    const [options, setOptions] = useState({
        host_discovery: true,
        os_detect: true,
        service_detect: true,
        basic_tcp: true,
        full_tcp: true,
        udp_scan: true,
        aggressive: true,
        nikto: true,
        web_enum: true,
        ssl_scan: true,
        vuln_scan: true,
        auth_checks: true,
        priv_esc: true,
        persistence: true,
        dos_check: true,
        network_stack: true,
        container: true,
        password_policy: true,
        listening_services: true,
        firewall: true
    });

    const optionTimes = {
        host_discovery: 15,
        os_detect: 30,
        service_detect: 45,
        basic_tcp: 30,
        full_tcp: 600,
        udp_scan: 300,
        aggressive: 180,
        nikto: 600,
        web_enum: 60,
        ssl_scan: 45,
        vuln_scan: 120,
        auth_checks: 60,
        priv_esc: 5,
        persistence: 5,
        dos_check: 30,
        network_stack: 2,
        container: 2,
        password_policy: 2,
        listening_services: 2,
        firewall: 20
    };

    // Refs
    const terminalRef = useRef(null);
    const pieChartRef = useRef(null);
    const barChartRef = useRef(null);
    const pieChartInstance = useRef(null);
    const barChartInstance = useRef(null);
    const globalLogData = useRef("");

    // Initialize Charts
    const initCharts = () => {
        if (!window.Chart) return;

        // Destroy existing if any
        if (pieChartInstance.current) pieChartInstance.current.destroy();
        if (barChartInstance.current) barChartInstance.current.destroy();

        const ctxPie = pieChartRef.current.getContext('2d');
        const ctxBar = barChartRef.current.getContext('2d');

        window.Chart.defaults.color = '#888';
        window.Chart.defaults.borderColor = '#333';

        pieChartInstance.current = new window.Chart(ctxPie, {
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

        barChartInstance.current = new window.Chart(ctxBar, {
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
    };

    // Estimate Time Effect
    useEffect(() => {
        let totalSeconds = 0;
        Object.keys(options).forEach(key => {
            if (options[key] && optionTimes[key]) {
                totalSeconds += optionTimes[key];
            }
        });
        totalSeconds += 5; // Base overhead

        let display = "";
        if (totalSeconds < 60) {
            display = "~" + totalSeconds + " sec";
        } else {
            display = "~" + Math.ceil(totalSeconds / 60) + " min";
        }
        setEstimatedTime(display);
    }, [options]);

    // Auto-scroll terminal
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalOutput]);

    const handleOptionChange = (key) => {
        setOptions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleAll = () => {
        const allChecked = Object.values(options).every(v => v);
        const newOptions = {};
        Object.keys(options).forEach(key => {
            newOptions[key] = !allChecked;
        });
        setOptions(newOptions);
    };

    const updateDashboardMetrics = (textChunk) => {
        const openPorts = (textChunk.match(/open/gi) || []).length;
        const warnings = (textChunk.match(/warning|danger|filtered/gi) || []).length;
        const vulns = (textChunk.match(/cve-|vulnerable|exploit/gi) || []).length;
        const info = (textChunk.match(/info|discover/gi) || []).length;

        const tcp = (textChunk.match(/tcp/gi) || []).length;
        const udp = (textChunk.match(/udp/gi) || []).length;
        const http = (textChunk.match(/http/gi) || []).length;

        setMetrics(prev => ({
            ports: prev.ports + openPorts,
            vulns: prev.vulns + vulns,
            info: prev.info + info,
            warnings: prev.warnings + warnings,
            tcp: prev.tcp + tcp,
            udp: prev.udp + udp,
            http: prev.http + http
        }));

        if (pieChartInstance.current) {
            const ds = pieChartInstance.current.data.datasets[0];
            ds.data[0] += info;
            ds.data[1] += openPorts;
            ds.data[2] += warnings;
            ds.data[3] += vulns;
            pieChartInstance.current.update();
        }

        if (barChartInstance.current) {
            const ds = barChartInstance.current.data.datasets[0];
            ds.data[0] += tcp;
            ds.data[1] += udp;
            ds.data[2] += openPorts;
            ds.data[3] += http;
            barChartInstance.current.update();
        }
    };

    const startScan = async () => {
        if (!consent) {
            alert("ACCESS DENIED: You must authorize this scan.");
            return;
        }

        // Reset
        setMetrics({ ports: 0, vulns: 0, info: 0, warnings: 0, tcp: 0, udp: 0, http: 0 });
        if (pieChartInstance.current) {
            pieChartInstance.current.data.datasets[0].data = [0, 0, 0, 0];
            pieChartInstance.current.update();
        }
        if (barChartInstance.current) {
            barChartInstance.current.data.datasets[0].data = [0, 0, 0, 0];
            barChartInstance.current.update();
        }
        globalLogData.current = "";
        setTerminalOutput([]);
        setIsScanning(true);
        setStatus("RUNNING");

        try {
            const payload = {
                target_ip: targetIp,
                target_network: targetNetwork,
                options,
                consent: { user_confirmation: consent },
                local_llm: false
            };

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
                globalLogData.current += text;
                setTerminalOutput(prev => [...prev, text]);

                updateDashboardMetrics(text);

                const execMatch = text.match(/Executing: (.*)/);
                if (execMatch) {
                    setCurrentTask(execMatch[1].substring(0, 40) + "...");
                }
            }

        } catch (err) {
            setTerminalOutput(prev => [...prev, `\n[!] ERROR: ${err.message}`]);
        } finally {
            setIsScanning(false);
            setStatus("COMPLETE");
            setCurrentTask("Scan finished.");
        }
    };

    const sendInput = async () => {
        if (!interactiveInput) return;
        try {
            await fetch('http://localhost:5001/input', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: interactiveInput })
            });
            setInteractiveInput("");
        } catch (err) {
            console.error("Failed to send input", err);
        }
    };

    const downloadReport = () => {
        const blob = new Blob([globalLogData.current], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `security_report_${new Date().toISOString().slice(0, 19)}.txt`;
        a.click();
    };

    return (
        <div className="sec-ops-wrapper">
            <Script
                src="https://cdn.jsdelivr.net/npm/chart.js"
                strategy="afterInteractive"
                onLoad={() => initCharts()}
            />

            <style jsx global>{`
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
                
                .sec-ops-wrapper {
                    background-color: var(--bg-color);
                    color: var(--text-color);
                    font-family: var(--font-main);
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    box-sizing: border-box;
                    width: 100%;
                }

                /* Scrollbar Styling */
                .sec-ops-wrapper ::-webkit-scrollbar { width: 8px; }
                .sec-ops-wrapper ::-webkit-scrollbar-track { background: #000; }
                .sec-ops-wrapper ::-webkit-scrollbar-thumb { background: var(--dim-text); border-radius: 4px; }
                .sec-ops-wrapper ::-webkit-scrollbar-thumb:hover { background: var(--accent); }

                .sec-ops-title {
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
                    overflow: hidden;
                }

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

                .terminal-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    min-width: 0;
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
                .interactive-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: #fff;
                    font-family: var(--font-main);
                    font-size: 14px;
                    outline: none;
                }
                .send-input-btn {
                    background: var(--dim-text);
                    color: #000;
                    border: none;
                    padding: 5px 10px;
                    cursor: pointer;
                    font-weight: bold;
                }
                .send-input-btn:hover {
                    background: var(--accent);
                }

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

                .chart-container-wrapper {
                    background: #000;
                    border: 1px solid #333;
                    padding: 10px;
                    border-radius: 4px;
                    min-height: 200px;
                }

                .dash-header {
                    margin: 0 0 10px 0;
                    color: #fff;
                    border-bottom: 1px solid #444;
                    padding-bottom: 5px;
                    font-size: 0.9em;
                    text-transform: uppercase;
                }

                .input-group label {
                    display: block;
                    margin-bottom: 5px;
                    color: var(--accent);
                    font-weight: bold;
                    font-size: 0.8rem;
                }

                .text-input {
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

                .run-btn {
                    background: var(--accent);
                    color: black;
                    border: none;
                    padding: 12px;
                    width: 100%;
                    font-weight: bold;
                    font-size: 1rem;
                    margin-top: auto;
                    cursor: pointer;
                }
                .run-btn:hover { box-shadow: 0 0 15px var(--accent); }
                .run-btn:disabled { background: #333; color: #555; cursor: not-allowed; box-shadow: none; }

                .btn-small {
                    background: transparent;
                    border: 1px solid var(--dim-text);
                    color: var(--dim-text);
                    padding: 4px 8px;
                    font-size: 0.7rem;
                    cursor: pointer;
                }
                .btn-small:hover { border-color: var(--accent); color: var(--accent); }

                .consent-box {
                    border: 1px solid var(--danger);
                    padding: 8px;
                    background: rgba(255, 0, 0, 0.05);
                    margin-top: 10px;
                }
                
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

                .loading-bar {
                    height: 4px;
                    width: 100%;
                    background: #333;
                    margin-top: 5px;
                    position: relative;
                    overflow: hidden;
                }
                .loading-bar-inner {
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

                .metric-card {
                    background: #111;
                    padding: 10px;
                    border-left: 3px solid var(--dim-text);
                    margin-bottom: 5px;
                }
                .metric-value { font-size: 1.5em; color: #fff; }
                .metric-label { font-size: 0.7em; color: #888; text-transform: uppercase; }
            `}</style>
            <div className="main-layout">
                {/* LEFT CONTROL PANEL */}
                <div className="controls">
                    <div className="input-group">
                        <label>TARGET IP</label>
                        <input className="text-input" type="text" value={targetIp} onChange={(e) => setTargetIp(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>TARGET NETWORK</label>
                        <input className="text-input" type="text" value={targetNetwork} onChange={(e) => setTargetNetwork(e.target.value)} />
                    </div>

                    <div className="time-estimate">
                        ESTIMATED TIME: <span className="time-value">{estimatedTime}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="section-title" style={{ border: 'none', margin: 0 }}>MODULES</span>
                        <button className="btn-small" onClick={toggleAll}>TOGGLE ALL</button>
                    </div>

                    <div className="options-grid">
                        <div className="section-title">Reconnaissance</div>
                        <label className="checkbox-wrapper"><input type="checkbox" checked={options.host_discovery} onChange={() => handleOptionChange('host_discovery')} /> Host Discovery</label>
                        <label className="checkbox-wrapper"><input type="checkbox" checked={options.os_detect} onChange={() => handleOptionChange('os_detect')} /> OS Fingerprint</label>
                        <label className="checkbox-wrapper"><input type="checkbox" checked={options.service_detect} onChange={() => handleOptionChange('service_detect')} /> Service Detect</label>

                        <div className="section-title">Network Scan</div>
                        <label className="checkbox-wrapper"><input type="checkbox" checked={options.basic_tcp} onChange={() => handleOptionChange('basic_tcp')} /> Basic TCP</label>
                        <label className="checkbox-wrapper"><input type="checkbox" checked={options.full_tcp} onChange={() => handleOptionChange('full_tcp')} /> Full TCP (1-65535)</label>
                        <label className="checkbox-wrapper"><input type="checkbox" checked={options.udp_scan} onChange={() => handleOptionChange('udp_scan')} /> UDP Top 100</label>
                        <label className="checkbox-wrapper"><input type="checkbox" checked={options.aggressive} onChange={() => handleOptionChange('aggressive')} /> Aggressive (-A)</label>

                        <div className="section-title">Web & App</div>
                        <label className="checkbox-wrapper"><input type="checkbox" checked={options.nikto} onChange={() => handleOptionChange('nikto')} /> Nikto Scanner</label>
                        <label className="checkbox-wrapper"><input type="checkbox" checked={options.web_enum} onChange={() => handleOptionChange('web_enum')} /> Web Enumeration</label>
                        <label className="checkbox-wrapper"><input type="checkbox" checked={options.ssl_scan} onChange={() => handleOptionChange('ssl_scan')} /> SSL/TLS Audit</label>

                        <div className="section-title">Security Audit</div>
                        <label className="checkbox-wrapper"><input type="checkbox" checked={options.vuln_scan} onChange={() => handleOptionChange('vuln_scan')} /> Vulcan Scripts</label>
                        <label className="checkbox-wrapper"><input type="checkbox" checked={options.auth_checks} onChange={() => handleOptionChange('auth_checks')} /> Weak Auth</label>
                        <label className="checkbox-wrapper"><input type="checkbox" checked={options.priv_esc} onChange={() => handleOptionChange('priv_esc')} /> Priv Escalation</label>
                        <label className="checkbox-wrapper"><input type="checkbox" checked={options.persistence} onChange={() => handleOptionChange('persistence')} /> Persistence</label>
                        <label className="checkbox-wrapper"><input type="checkbox" checked={options.dos_check} onChange={() => handleOptionChange('dos_check')} /> DoS Exposure</label>
                    </div>

                    <div className="consent-box">
                        <label className="checkbox-wrapper" style={{ color: 'var(--danger)' }}>
                            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                            AUTHORIZE LOCAL SCAN
                        </label>
                    </div>

                    <button className="run-btn" onClick={startScan} disabled={isScanning}>INITIATE SCAN</button>
                </div>

                {/* MIDDLE TERMINAL PANEL */}
                <div className="terminal-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '5px 10px' }}>
                        <div>
                            <span className={`status-badge ${isScanning ? 'active' : ''}`} style={isScanning ? { background: 'var(--accent)', color: 'black' } : {}}>{status}</span>
                            <span style={{ fontSize: '0.8em', color: '#888', marginLeft: '10px' }}>{currentTask}</span>
                        </div>
                        <button className="btn-small" onClick={downloadReport} disabled={!globalLogData.current}>DOWNLOAD REPORT</button>
                    </div>

                    <div className="terminal" ref={terminalRef}>
                        {terminalOutput.map((line, i) => (
                            <React.Fragment key={i}>
                                {line}
                                {/* Use regex to split lines properly if needed, but standard text mapping works for basic lines. The original code used textContent += text, which handles newlines natively in transparent pre-wrap */}
                            </React.Fragment>
                        ))}
                    </div>

                    {isScanning && (
                        <div className="loading-bar">
                            <div className="loading-bar-inner"></div>
                        </div>
                    )}

                    {/* INPUT BAR */}
                    <div className="input-bar">
                        <span className="prompt-symbol">{'>_'}</span>
                        <input
                            type="text"
                            className="interactive-input"
                            placeholder="Type here (e.g. password) then press Enter..."
                            disabled={!isScanning}
                            value={interactiveInput}
                            onChange={(e) => setInteractiveInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendInput()}
                        />
                        <button className="send-input-btn" onClick={sendInput} disabled={!isScanning}>SEND</button>
                    </div>
                </div>

                {/* RIGHT DASHBOARD PANEL */}
                <div className="dashboard">
                    <h3 className="dash-header">Live Analytics</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="metric-card">
                            <div className="metric-value">{metrics.ports}</div>
                            <div className="metric-label">Open Ports</div>
                        </div>
                        <div className="metric-card" style={{ borderColor: 'var(--danger)' }}>
                            <div className="metric-value">{metrics.vulns}</div>
                            <div className="metric-label">Vulns</div>
                        </div>
                    </div>

                    <div className="chart-container-wrapper">
                        <canvas ref={pieChartRef}></canvas>
                    </div>

                    <div className="chart-container-wrapper">
                        <canvas ref={barChartRef}></canvas>
                    </div>

                    <div style={{ fontSize: '0.75em', color: '#555', textAlign: 'center', marginTop: 'auto' }}>
                        SEC-OPS TERMINAL v2.2<br />
                        Local Security Validation
                    </div>
                </div>
            </div>
        </div>
    );
}
