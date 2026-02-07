"use client";
import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { motion, AnimatePresence } from "framer-motion";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

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

    // Checkbox State
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

    // Report & AI State
    const [showReport, setShowReport] = useState(false);
    const [summary, setSummary] = useState("");
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [aiMode, setAiMode] = useState('local'); // 'local' | 'openai'

    // We need a ref for the report container to capture it for PDF
    const reportRef = useRef(null);

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
    // Use a mutable ref for log data to avoid re-renders on every char, separate from terminalOutput
    const globalLogData = useRef("");

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
    };

    const startScan = async () => {
        if (!consent) {
            alert("ACCESS DENIED: You must authorize this scan.");
            return;
        }

        // Reset
        setMetrics({ ports: 0, vulns: 0, info: 0, warnings: 0, tcp: 0, udp: 0, http: 0 });
        setSummary("");
        setShowReport(false);
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

            // Auto-show report on completion
            setTimeout(() => {
                setShowReport(true);
            }, 1500);

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

    // AI Summarization
    // AI Summarization
    // AI Summarization
    const generateSummary = async () => {
        if (!globalLogData.current) return;
        setIsSummarizing(true);
        setSummary("");

        try {
            if (aiMode === 'openai') {
                const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
                if (!apiKey) throw new Error("OpenAI API Key not found in env");

                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-4-turbo",
                        messages: [
                            {
                                role: "system",
                                content: "You are a senior cybersecurity analyst. You have been provided with **Network Security Scan Data** from a local network assessment. Provide a comprehensive executive summary, critical findings, dangerous vulnerabilities, and 3 specific remediation steps. Format strictly as Markdown."
                            },
                            {
                                role: "user",
                                content: `RAW LOG DATA:\n${globalLogData.current.substring(0, 30000)}`
                            }
                        ]
                    })
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error?.message || "OpenAI API request failed");
                }

                const data = await response.json();
                setSummary(data.choices[0].message.content);

            } else {
                // Local Backend (Ollama)
                const response = await fetch('http://localhost:5001/summarize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ report: globalLogData.current })
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || "Backend summarization failed");
                }

                const data = await response.json();
                setSummary(data.summary);
            }

        } catch (error) {
            console.error("AI Summary failed:", error);
            setSummary(`Analysis Failed: ${error.message}.`);
        } finally {
            setIsSummarizing(false);
        }
    };

    // Export PDF
    const exportReport = async () => {
        if (!reportRef.current) return;

        try {
            // Hide buttons for screenshot
            const buttons = document.querySelector('.report-actions');
            if (buttons) buttons.style.display = 'none';

            const element = reportRef.current;
            const canvas = await html2canvas(element, {
                backgroundColor: "#0d0d0d",
                scale: 2 // Improve quality
            });

            // Restore buttons
            if (buttons) buttons.style.display = 'flex';

            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`sec-ops-report-${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            console.error("Export failed:", err);
            const buttons = document.querySelector('.report-actions');
            if (buttons) buttons.style.display = 'flex';
            alert("Export failed. See console.");
        }
    };

    // Chart Data Configs
    const doughnutData = {
        labels: ['Info', 'Open Ports', 'Warnings', 'Critical'],
        datasets: [{
            data: [metrics.info, metrics.ports, metrics.warnings, metrics.vulns],
            backgroundColor: ['#2196f3', '#4caf50', '#ff9800', '#f44336'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const barData = {
        labels: ['TCP', 'UDP', 'Services', 'Web'],
        datasets: [{
            label: 'Detections',
            data: [metrics.tcp, metrics.udp, metrics.ports + metrics.info, metrics.http],
            backgroundColor: '#00ff00',
            barThickness: 20
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#888', boxWidth: 10 } },
            title: { display: false }
        },
        scales: {
            x: { ticks: { color: '#888' }, grid: { color: '#333' } },
            y: { ticks: { color: '#888' }, grid: { color: '#333' } }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: { position: 'right', labels: { color: '#888', boxWidth: 10 } }
        }
    };

    return (
        <div className="sec-ops-wrapper">
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
                    overflow: hidden; 
                    position: relative;
                }

                /* Scrollbar Styling */
                .sec-ops-wrapper ::-webkit-scrollbar { width: 8px; }
                .sec-ops-wrapper ::-webkit-scrollbar-track { background: #000; }
                .sec-ops-wrapper ::-webkit-scrollbar-thumb { background: var(--dim-text); border-radius: 4px; }
                .sec-ops-wrapper ::-webkit-scrollbar-thumb:hover { background: var(--accent); }

                .main-layout {
                    display: flex;
                    flex: 1;
                    gap: 20px;
                    overflow: hidden;
                    position: relative;
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
                    position: relative;
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
                    transition: all 0.2s;
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

                /* Report Overlay Styles */
                .report-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(13, 13, 13, 0.95);
                    backdrop-filter: blur(10px);
                    z-index: 100;
                    display: flex;
                    flex-direction: column;
                    padding: 40px;
                    box-sizing: border-box;
                    overflow-y: auto;
                }
                
                .report-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--accent);
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                
                .report-title {
                    font-size: 2.2rem;
                    color: var(--accent);
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: bold;
                }

                .report-actions {
                    display: flex;
                    gap: 15px;
                }

                .action-btn {
                    background: var(--panel-bg);
                    border: 1px solid var(--dim-text);
                    color: var(--text-color);
                    padding: 12px 20px;
                    cursor: pointer;
                    font-family: var(--font-main);
                    text-transform: uppercase;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s;
                    font-size: 0.9rem;
                }
                .action-btn:hover {
                    background: var(--dim-text);
                    color: #000;
                    border-color: var(--accent);
                    box-shadow: 0 0 15px rgba(0, 255, 0, 0.4);
                }
                .action-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .action-btn.primary {
                    background: var(--dim-text);
                    color: #000;
                }
                .action-btn.primary:hover {
                    background: var(--accent);
                }

                .report-grid {
                    display: grid;
                    grid-template-columns: 3fr 2fr;
                    gap: 30px;
                    flex: 1;
                    padding-bottom: 50px;
                }
                
                .report-column {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                .report-card {
                    background: #111;
                    border: 1px solid var(--border-color);
                    padding: 25px;
                    border-radius: 6px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.5);
                }
                
                .card-title {
                    color: #fff;
                    border-bottom: 1px solid #333;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                    font-size: 1.2em;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .summary-content {
                    white-space: pre-wrap;
                    line-height: 1.6;
                    color: #ccc;
                    font-size: 1rem;
                    font-family: sans-serif; /* Readable font for summary */
                }
                
                .ai-loading {
                    color: var(--warning);
                    font-style: italic;
                    animation: pulse 1s infinite;
                }
                @keyframes pulse { 50% { opacity: 0.5; } }

                .metric-grid-large {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }
                
                .metric-card-large {
                    background: #000;
                    padding: 20px;
                    border: 1px solid #333;
                    text-align: center;
                    border-radius: 4px;
                }
                .metric-val-large { font-size: 2.5em; font-weight: bold; color: #fff; }
                .metric-lbl-large { color: #888; text-transform: uppercase; font-size: 0.8em; margin-top: 5px; }

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

                    {metrics.ports > 0 && !isScanning && (
                        <button className="run-btn" style={{ marginTop: '10px', background: '#333', color: '#fff' }} onClick={() => setShowReport(true)}>VIEW REPORT</button>
                    )}
                </div>

                {/* MIDDLE TERMINAL PANEL */}
                <div className="terminal-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '5px 10px' }}>
                        <div>
                            <span className={`status-badge ${isScanning ? 'active' : ''}`} style={isScanning ? { background: 'var(--accent)', color: 'black' } : {}}>{status}</span>
                            <span style={{ fontSize: '0.8em', color: '#888', marginLeft: '10px' }}>{currentTask}</span>
                        </div>
                    </div>

                    <div className="terminal" ref={terminalRef}>
                        {terminalOutput.map((line, i) => (
                            <React.Fragment key={i}>
                                {line}
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
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                    </div>

                    <div className="chart-container-wrapper">
                        <Bar data={barData} options={chartOptions} />
                    </div>

                    <div style={{ fontSize: '0.75em', color: '#555', textAlign: 'center', marginTop: 'auto' }}>
                        SEC-OPS TERMINAL v2.3<br />
                        Local Security Validation
                    </div>
                </div>

                {/* REPORT OVERLAY */}
                <AnimatePresence>
                    {showReport && (
                        <motion.div
                            className="report-overlay"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                        >
                            <div ref={reportRef} style={{ background: '#0d0d0d', padding: '20px', minHeight: '100%', color: 'white' }}>
                                <div className="report-header">
                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>SEC-OPS DIAGNOSTIC REPORT</div>
                                        <div className="report-title">Security Analysis Result</div>
                                        <div style={{ fontSize: '1rem', color: '#888', marginTop: '5px' }}>
                                            Target: <span style={{ color: 'white' }}>{targetIp}</span> | {new Date().toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="report-actions" data-html2canvas-ignore>
                                        <button className="action-btn" onClick={() => setShowReport(false)}>← Back</button>

                                        <div style={{ display: 'flex', gap: '0' }}>
                                            <select
                                                value={aiMode}
                                                onChange={(e) => setAiMode(e.target.value)}
                                                className="action-btn"
                                                style={{ borderRight: 'none', appearance: 'none', paddingRight: '10px' }}
                                            >
                                                <option value="local">Local LLM</option>
                                                <option value="openai">AI+ (OpenAI)</option>
                                            </select>
                                            <button
                                                className="action-btn"
                                                onClick={generateSummary}
                                                disabled={isSummarizing || !globalLogData.current}
                                                style={{ borderLeft: '1px solid #333' }}
                                            >
                                                {isSummarizing ? "Analyzing..." : "Summarize"}
                                            </button>
                                        </div>

                                        <button className="action-btn primary" onClick={exportReport}>Export PDF</button>
                                    </div>
                                </div>

                                <div className="report-grid">
                                    <div className="report-column">
                                        <div className="report-card">
                                            <h3 className="card-title">AI Executive Summary</h3>
                                            {summary ? (
                                                <div className="summary-content">{summary}</div>
                                            ) : (
                                                <div style={{ color: '#666', padding: '20px', textAlign: 'center', border: '1px dashed #333' }}>
                                                    {isSummarizing ?
                                                        <span className="ai-loading">Generating security insights from scan data...</span> :
                                                        <div>
                                                            <p>No summary generated yet.</p>
                                                            <p style={{ fontSize: '0.8rem' }}>
                                                                Click "Summarize" to analyze data using <b>{aiMode === 'local' ? 'Local LLM (Ollama)' : 'AI+ (GPT-4)'}</b>.
                                                            </p>
                                                        </div>
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div className="report-card" style={{ flex: 1 }}>
                                            <h3 className="card-title">Network Service Distribution</h3>
                                            <div style={{ height: '350px' }}>
                                                <Bar
                                                    data={barData}
                                                    options={{
                                                        ...chartOptions,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: { display: true, position: 'top', labels: { color: '#888' } },
                                                            title: { display: false }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="report-column">
                                        <div className="report-card">
                                            <h3 className="card-title">Vulnerability Assessment</h3>
                                            <div style={{ height: '300px', marginBottom: '20px' }}>
                                                <Doughnut data={doughnutData} options={{
                                                    ...doughnutOptions,
                                                    plugins: {
                                                        legend: { position: 'bottom', labels: { color: '#bbb', padding: 20 } }
                                                    }
                                                }} />
                                            </div>

                                            <div className="metric-grid-large">
                                                <div className="metric-card-large" style={{ borderColor: '#f44336' }}>
                                                    <div className="metric-val-large" style={{ color: '#f44336' }}>{metrics.vulns}</div>
                                                    <div className="metric-lbl-large">Critical Vulns</div>
                                                </div>
                                                <div className="metric-card-large" style={{ borderColor: '#ff9800' }}>
                                                    <div className="metric-val-large" style={{ color: '#ff9800' }}>{metrics.warnings}</div>
                                                    <div className="metric-lbl-large">Warnings</div>
                                                </div>
                                                <div className="metric-card-large" style={{ borderColor: '#4caf50' }}>
                                                    <div className="metric-val-large" style={{ color: '#4caf50' }}>{metrics.ports}</div>
                                                    <div className="metric-lbl-large">Open Ports</div>
                                                </div>
                                                <div className="metric-card-large" style={{ borderColor: '#2196f3' }}>
                                                    <div className="metric-val-large" style={{ color: '#2196f3' }}>{metrics.info}</div>
                                                    <div className="metric-lbl-large">Info Points</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="report-card">
                                            <h3 className="card-title">Scan Telemetry</h3>
                                            <div style={{ fontSize: '0.9rem', color: '#aaa', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '5px' }}>
                                                    <span>Status</span> <span style={{ color: '#fff' }}>{status}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '5px' }}>
                                                    <span>Scan Duration</span> <span style={{ color: '#fff' }}>{estimatedTime}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '5px' }}>
                                                    <span>Active Modules</span> <span style={{ color: '#fff' }}>{Object.keys(options).filter(k => options[k]).length}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '5px' }}>
                                                    <span>Data Transferred</span> <span style={{ color: '#fff' }}>{globalLogData.current ? (globalLogData.current.length / 1024).toFixed(2) : 0} KB</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
