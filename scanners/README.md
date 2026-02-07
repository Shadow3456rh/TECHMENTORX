# SEC-OPS Local Network Auditor
## Fully Interactive Security Testing Platform

This is a comprehensive, local-only network security testing tool built with Python (Flask) and a modern HTML5/JS frontend. It provides a terminal-like interface in the browser to execute professional security auditing tools (Nmap, Nikto, etc.) against your own local network.

### 🌟 Key Features
- **Real-Time Terminal Streaming**: Watch scan outputs line-by-line as they happen, just like a real terminal.
- **Interactive Shell**: Send input (like `sudo` passwords or confirmation prompts) directly to the backend tools from the browser.
- **Live Analytics Dashboard**: Visualizes open ports, vulnerabilities, and warnings with automated charts.
- **Time Estimation**: Dynamically calculates estimated scan time based on selected modules.
- **HTML Report Generation**: One-click download of the entire scan log.
- **Safe Execution**: Strictly limited to local networks only; consent-gated execution.

---

## 🛠 Architecture

### 1. Backend (`backend.py`)
- **Technology**: Flask (Python).
- **PTY Execution**: Uses `pty.openpty()` to spawn subprocesses. This mimics a real terminal, allowing:
  - Unbuffered, instant output (no lag).
  - Interactive input (stdin) handling.
- **Threading**: Uses background threads to manage the command execution queue while the main thread streams data to the frontend.
- **API Endpoints**:
  - `POST /run`: Starts the scan thread and streams output via chunked transfer encoding.
  - `POST /input`: Writes keystrokes to the running process's Master File Descriptor.

### 2. Frontend (`ui_app.py`)
- **Technology**: HTML5, CSS3, Vanilla JavaScript.
- **Visuals**: Cyber/Dark terminal aesthetic with Chart.js for analytics.
- **Communication**: 
  - Uses `fetch()` with `ReadableStream` to consume the backend text stream.
  - Real-time regex parsing of the stream to update the dashboard metrics (e.g., detecting "80/tcp open").

---

## 🚀 Installation & Usage

### Prerequisites
- Python 3.x
- `nmap` (Network Mapper)
- `nikto` (Web Scanner) - *Optional but recommended*
- `docker` - *Optional (for container checks)*

### Setup

1. **Install Dependencies**:
   ```bash
   pip install flask
   # Ensure nmap is installed on your system (e.g., brew install nmap)
   ```

2. **Start the Backend (Root Required)**:
   Since functionality like OS Fingerprinting (`nmap -O`) requires raw socket access, the backend must run as root.
   ```bash
   sudo python3 backend.py
   ```
   *running on port 5001*

3. **Start the Frontend**:
   Open a new terminal window.
   ```bash
   python3 ui_app.py
   ```
   *running on port 5002*

4. **Access the Tool**:
   Open your browser to: **`http://localhost:5002`**

---

## ⚠️ Legal Disclaimer
This tool is designed for **EDUCATIONAL AND DEFENSIVE PURPOSES ONLY**. 
- Only scan networks and devices you explicitly own or have written permission to test.
- The developers assume no liability for misuse or damage caused by this tool.
