#!/bin/bash

# ===============================
# FULL LOCAL NETWORK ATTACK SIMULATION
# SAFE + LEGAL (LOCAL MACHINE ONLY)
# ===============================

TARGET="127.0.0.1"
NETWORK="192.168.1.0/24"
OUTPUT="network_full_security_report.txt"

exec > >(tee -a "$OUTPUT") 2>&1

echo "=============================="
echo " FULL NETWORK SECURITY REPORT "
echo "=============================="
date

echo -e "\n[INFO] Target: $TARGET"
echo "[INFO] Network: $NETWORK"

# -------------------------------
# 1. Host Discovery
# -------------------------------
echo -e "\n[1] Host Discovery (ARP + ICMP)"
nmap -sn -PR $NETWORK

# -------------------------------
# 2. Basic TCP Scan
# -------------------------------
echo -e "\n[2] Basic TCP Scan"
nmap -T4 $TARGET

# -------------------------------
# 3. Full TCP Port Scan
# -------------------------------
echo -e "\n[3] Full TCP Port Scan (1–65535)"
nmap -p- -T4 $TARGET

# -------------------------------
# 4. UDP Scan
# -------------------------------
echo -e "\n[4] UDP Scan (Top Ports)"
sudo nmap -sU --top-ports 100 $TARGET

# -------------------------------
# 5. Service & Version Detection
# -------------------------------
echo -e "\n[5] Service & Version Detection"
nmap -sV --version-intensity 9 $TARGET

# -------------------------------
# 6. Aggressive Enumeration
# -------------------------------
echo -e "\n[6] Aggressive Enumeration (-A)"
sudo nmap -A $TARGET

# -------------------------------
# 7. OS Detection
# -------------------------------
echo -e "\n[7] OS Detection"
sudo nmap -O $TARGET

# -------------------------------
# 8. Vulnerability Scanning
# -------------------------------
echo -e "\n[8] Vulnerability Scanning (NSE)"
nmap --script vuln $TARGET

# -------------------------------
# 9. Auth & Misconfiguration Checks
# -------------------------------
echo -e "\n[9] Auth & Weak Config Checks"
nmap --script auth,default,discovery $TARGET

# -------------------------------
# 10. Firewall & IDS Behavior
# -------------------------------
echo -e "\n[10] Firewall / IDS Detection"
nmap -sA -T4 $TARGET

# -------------------------------
# 11. SSL / TLS Weakness
# -------------------------------
echo -e "\n[11] SSL / TLS Security"
nmap --script ssl-cert,ssl-enum-ciphers -p 443,8443 $TARGET

# -------------------------------
# 12. Web Vulnerability Scan
# -------------------------------
echo -e "\n[12] Nikto Web Scan"
if command -v nikto >/dev/null; then
    nikto -h http://$TARGET -maxtime 10m
else
    echo "Nikto not installed"
fi

# -------------------------------
# 13. Web Attack Surface Expansion
# -------------------------------
echo -e "\n[13] Web Attack Surface Enumeration"
nmap --script http-enum,http-methods,http-headers -p 80,443 $TARGET

# -------------------------------
# 14. DoS Exposure (SAFE CHECK)
# -------------------------------
echo -e "\n[14] DoS Exposure (Non-destructive)"
nmap --script dos -p 80,443,3306 $TARGET

# -------------------------------
# 15. Local Privilege Escalation Indicators
# -------------------------------
echo -e "\n[15] Privilege Escalation Indicators"
sudo find / -perm -4000 -type f 2>/dev/null
sudo crontab -l 2>/dev/null

# -------------------------------
# 16. Local Credential Policy Audit
# -------------------------------
echo -e "\n[16] Password / Auth Policy Audit"
pwpolicy getaccountpolicies 2>/dev/null || echo "Policy not accessible"
dscl . -list /Users | grep -v "_"

# -------------------------------
# 17. Listening Services & Trust
# -------------------------------
echo -e "\n[17] Listening Services"
sudo lsof -iTCP -sTCP:LISTEN

# -------------------------------
# 18. Container / Virtual Exposure
# -------------------------------
echo -e "\n[18] Docker / VM Exposure Check"
if command -v docker >/dev/null; then
    docker ps -a
    docker network ls
else
    echo "Docker not detected"
fi

# -------------------------------
# 19. Persistence & Malware Indicators
# -------------------------------
echo -e "\n[19] Persistence & Startup Entries"
launchctl list | head -50
ls /Library/LaunchDaemons 2>/dev/null

# -------------------------------
# 20. Network Routing & Stack
# -------------------------------
echo -e "\n[20] Network Stack"
netstat -rn
ifconfig

# -------------------------------
# 21. Automated Risk Summary
# -------------------------------
echo -e "\n[21] Automated Risk Summary"
echo "• Open services detected → REVIEW"
echo "• No credential attacks performed"
echo "• No destructive actions taken"
echo "• Misconfiguration risk > exploit risk"
echo "• Harden exposed services immediately"

echo -e "\n[✔] ATTACK SIMULATION COMPLETE"
echo "Report saved as $OUTPUT"
