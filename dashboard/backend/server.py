import subprocess
import shlex
import shutil
import os
import datetime
import pty
import select
import threading
import queue
import time
import uuid
from flask import Flask, request, Response, jsonify, stream_with_context

app = Flask(__name__)

# Blockchain Integration (Optional)
try:
    from blockchain.logger import store_report_hash, verify_report_hash
    BLOCKCHAIN_ENABLED = True
except ImportError:
    BLOCKCHAIN_ENABLED = False
    print("Blockchain module not available or dependencies missing.")

# Global state to manage interactive session
SESSION = {
    "master_fd": None,
    "process": None,
    "output_queue": queue.Queue(),
    "active": False,
    "input_event": threading.Event()
}

# Add CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

def get_timestamp():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def interactive_command_executor(cmd_list, report_file):
    """
    Executes commands sequentially using PTY to support interactivity and unbuffered output.
    """
    SESSION["active"] = True
    
    # Send Start Header
    header = f"\n=== SESSION STARTED: {get_timestamp()} ===\n"
    SESSION["output_queue"].put(header)
    with open(report_file, "a") as f: f.write(header)

    for cmd in cmd_list:
        if not SESSION["active"]: break

        SESSION["output_queue"].put(f"\n\033[1;36m[{get_timestamp()}] Executing: {cmd}\033[0m\n")
        with open(report_file, "a") as f: f.write(f"\n[{get_timestamp()}] Executing: {cmd}\n")

        # Create PTY
        master, slave = pty.openpty()
        SESSION["master_fd"] = master
        
        try:
            # Start Process attached to PTY
            process = subprocess.Popen(
                cmd,
                shell=True,
                stdin=slave,
                stdout=slave,
                stderr=slave,
                preexec_fn=os.setsid,
                close_fds=True
            )
            SESSION["process"] = process
            os.close(slave)  # Close slave in parent

            # Read Loop
            while True:
                r, _, _ = select.select([master], [], [], 0.1)
                if master in r:
                    try:
                        data = os.read(master, 1024).decode('utf-8', errors='replace')
                        if data:
                            SESSION["output_queue"].put(data)
                            with open(report_file, "a") as f: f.write(data)
                        else:
                            break # EOF
                    except OSError:
                        break # PTY closed
                
                if process.poll() is not None:
                    # Capture remaining output
                    time.sleep(0.1) 
                    try:
                        while True:
                            data = os.read(master, 1024).decode('utf-8', errors='replace')
                            if not data: break
                            SESSION["output_queue"].put(data)
                            with open(report_file, "a") as f: f.write(data)
                    except (OSError, IndexError):
                        pass
                    break
        except Exception as e:
            err = f"\n[!] Exec Error: {str(e)}\n"
            SESSION["output_queue"].put(err)
        finally:
            if SESSION["master_fd"]:
                try: os.close(SESSION["master_fd"])
                except: pass
            SESSION["master_fd"] = None
            SESSION["process"] = None

    SESSION["output_queue"].put("\n=== SCAN COMPLETE ===\n")
    
    # Blockchain Logging Hook
    if BLOCKCHAIN_ENABLED:
        try:
            # Generate a unique scan ID for this session
            scan_id = f"scan_{int(datetime.datetime.now().timestamp())}"
            log_msg = f"\n[Blockchain] Logging Report Hash under ScanID: {scan_id}...\n"
            SESSION["output_queue"].put(log_msg)
            # Do NOT write to report file to preserve hash integrity
            
            # Store the hash of the generated report
            result = store_report_hash(report_file, scan_id=scan_id)
            
            if "error" in result:
                final_msg = f"[Blockchain] Failed: {result['error']}\n"
            else:
                final_msg = f"[Blockchain] Success! Hash: {result['report_hash']}\n[Blockchain] Tx: {result['tx_hash']}\n"
            
            SESSION["output_queue"].put(final_msg)
        except Exception as e:
            err_msg = f"\n[Blockchain] internal error: {e}\n"
            SESSION["output_queue"].put(err_msg)

    SESSION["output_queue"].put(None) # Sentinel
    SESSION["active"] = False


@app.route('/run', methods=['POST'])
def run_scan():
    # If a scan is already running, prevent new one
    if SESSION["active"]:
        return jsonify({"error": "Scan already in progress"}), 409

    data = request.json
    
    # 1. Strict Consent Check
    if not data.get('consent', {}).get('user_confirmation', False):
        return jsonify({"error": "User consent denied. Execution blocked."}), 403

    target_ip = shlex.quote(data.get('target_ip', '127.0.0.1'))
    target_net = shlex.quote(data.get('target_network', '192.168.1.0/24'))
    options = data.get('options', {})
    
    # Report File
    report_filename = "network_full_security_report.txt"
    
    # 2. Construct Scan List
    commands = []
    
    if options.get('host_discovery'): commands.append(f"nmap -sn -PR {target_net}")
    if options.get('basic_tcp'): commands.append(f"nmap -T4 {target_ip}")
    if options.get('full_tcp'): commands.append(f"nmap -p- -T4 {target_ip}")
    if options.get('udp_scan'): commands.append(f"sudo nmap -sU --top-ports 100 {target_ip}")
    if options.get('service_detect'): commands.append(f"nmap -sV --version-intensity 9 {target_ip}")
    if options.get('aggressive'): commands.append(f"sudo nmap -A {target_ip}")
    if options.get('os_detect'): commands.append(f"sudo nmap -O {target_ip}")
    if options.get('vuln_scan'): commands.append(f"nmap --script vuln {target_ip}")
    if options.get('auth_checks'): commands.append(f"nmap --script auth,default,discovery {target_ip}")
    if options.get('firewall'): commands.append(f"nmap -sA -T4 {target_ip}")
    if options.get('ssl_scan'): commands.append(f"nmap --script ssl-cert,ssl-enum-ciphers -p 443,8443 {target_ip}")
    
    if options.get('nikto'):
        if shutil.which("nikto"): commands.append(f"nikto -h http://{target_ip} -maxtime 10m")
        else: SESSION["output_queue"].put("\n[!] Nikto missing\n")

    if options.get('web_enum'): commands.append(f"nmap --script http-enum,http-methods,http-headers -p 80,443 {target_ip}")
    if options.get('dos_check'): commands.append(f"nmap --script dos -p 80,443,3306 {target_ip}")
    
    if options.get('priv_esc'):
        commands.append("sudo find / -perm -4000 -type f 2>/dev/null")
        commands.append("sudo crontab -l 2>/dev/null")

    if options.get('password_policy'):
        commands.append("pwpolicy getaccountpolicies 2>/dev/null || echo 'Policy not accessible'")
        commands.append('dscl . -list /Users | grep -v "_"')

    if options.get('listening_services'): commands.append("sudo lsof -iTCP -sTCP:LISTEN")
    
    if options.get('container'):
        if shutil.which("docker"):
            commands.append("docker ps -a")
            commands.append("docker network ls")
            
    if options.get('persistence'):
        commands.append("launchctl list | head -50")
        commands.append("ls /Library/LaunchDaemons 2>/dev/null")

    if options.get('network_stack'):
        commands.append("netstat -rn")
        commands.append("ifconfig")

    # Start Execution Thread
    t = threading.Thread(target=interactive_command_executor, args=(commands, report_filename))
    t.daemon = True
    t.start()

    # Stream Response Generator
    def generate():
        while True:
            try:
                # Wait for data with timeout to allow checking for finished
                data = SESSION["output_queue"].get(timeout=0.5)
                if data is None: break # Sentinel
                yield data
            except queue.Empty:
                if not t.is_alive() and SESSION["output_queue"].empty():
                    break
                continue

    return Response(stream_with_context(generate()), mimetype='text/plain')


@app.route('/input', methods=['POST'])
def send_input():
    """
    Endpoint to receive user input (e.g. passwords) and write to the PTY.
    """
    if not SESSION["active"] or SESSION["master_fd"] is None:
        return jsonify({"error": "No active interactive session"}), 400

    user_input = request.json.get("input", "")
    try:
        # Add newline if not present, as usually terminal input requires it
        if not user_input.endswith("\n"):
            user_input += "\n"
            
        os.write(SESSION["master_fd"], user_input.encode())
        return jsonify({"status": "sent"})
    except OSError:
        return jsonify({"error": "Failed to write to process"}), 500



@app.route('/blockchain/verify', methods=['POST'])
def check_report_integrity():
    if not BLOCKCHAIN_ENABLED:
        return jsonify({"error": "Blockchain module disabled"}), 503
    
    scan_id = request.form.get('scan_id')
    file = request.files.get('report_file')
    
    if not scan_id:
        return jsonify({"valid": False, "error": "Missing scan_id"}), 400

    if file:
        # Verify uploaded file
        # Save explicitly or read content
        temp_path = f"/tmp/{file.filename}_{uuid.uuid4()}"
        file.save(temp_path)
        is_valid = verify_report_hash(temp_path, scan_id)
        os.remove(temp_path)
    else:
        # Verify current local report (default)
        if os.path.exists("network_full_security_report.txt"):
            is_valid = verify_report_hash("network_full_security_report.txt", scan_id)
        else:
            return jsonify({"valid": False, "error": "No local report found and no file uploaded"}), 404

    return jsonify({"valid": is_valid, "scan_id": scan_id})

@app.route('/summarize', methods=['POST'])
def summarize_report():
    data = request.json
    report_content = data.get('report', '')
    if not report_content:
        # As a fallback, try reading the last generated file
        if os.path.exists("network_full_security_report.txt"):
             with open("network_full_security_report.txt", "r") as f:
                 report_content = f.read()
        else:
             return jsonify({"error": "No report content provided or found locally"}), 400

    try:
        # Construct the prompt
        prompt = f"Summarize the given Network Penetration testing report. Highlight critical vulnerabilities, open ports, and suggest remediation steps:\n\n{report_content}"
        
        # Call Ollama via subprocess
        # checks if ollama is installed
        if not shutil.which("ollama"):
             return jsonify({"error": "Ollama is not installed or not in PATH. Please install Ollama to use this feature."}), 500

        process = subprocess.Popen(
            ['ollama', 'run', 'llama3.1:8b'], 
            stdin=subprocess.PIPE, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE,
            text=True
        )
        
        stdout, stderr = process.communicate(input=prompt)
        
        if process.returncode != 0:
            return jsonify({"error": f"Ollama execution failed: {stderr}"}), 500
            
        return jsonify({"summary": stdout})
        
    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

if __name__ == '__main__':
    print("Backend starting on port 5001...")
    # Threaded=True is essential for async input handling while streaming
    app.run(host='0.0.0.0', port=5001, debug=True, threaded=True)
