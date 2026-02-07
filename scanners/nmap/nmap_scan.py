# scanners/nmap/nmap_scan.py

import subprocess
import sys
import json
from urllib.parse import urlparse

def run_nmap(target: str):
    """
    Safe Nmap scan:
    - Accepts URL or host
    - Extracts host and port correctly
    """

    parsed = urlparse(target)

    host = parsed.hostname or target
    port = parsed.port

    command = ["nmap", "-sT", "-sV", "--open"]

    if port:
        command.extend(["-p", str(port)])

    command.append(host)

    result = subprocess.run(
        command,
        capture_output=True,
        text=True
    )

    output = {
        "tool": "nmap",
        "target": target,
        "resolved_host": host,
        "port": port,
        "stdout": result.stdout,
        "stderr": result.stderr
    }

    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python nmap_scan.py <target>")
        sys.exit(1)

    run_nmap(sys.argv[1])
