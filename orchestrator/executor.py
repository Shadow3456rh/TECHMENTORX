# orchestrator/executor.py

import subprocess
import json
from pathlib import Path


def run_nmap(target: str):
    print("[+] Running Nmap scan...")
    result = subprocess.run(
        ["python3", "scanners/nmap/nmap_scan.py", target],
        capture_output=True,
        text=True
    )
    return result.stdout


def run_nikto(target: str):
    print("[+] Running Nikto scan...")
    result = subprocess.run(
        ["python3", "scanners/nikto/nikto_scan.py", target],
        capture_output=True,
        text=True
    )
    return result.stdout


def execute_tool(tool_name: str, target: str):
    """
    Execute a single tool safely.
    """
    if tool_name == "nmap":
        return run_nmap(target)

    if tool_name == "nikto":
        return run_nikto(target)

    raise ValueError(f"Unknown tool: {tool_name}")
