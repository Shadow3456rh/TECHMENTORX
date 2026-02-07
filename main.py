# main.py

from orchestrator.pipeline import run_security_pipeline

config = {
    "mode": "manual",
    "test_type": "network_scan",
    "target": "http://localhost:3000",
    "intensity": "standard",
    "output": ["dashboard"]
}

results = run_security_pipeline(config)

print("\n=== FINAL RESULTS ===")
for tool, output in results.items():
    print(f"\n--- {tool.upper()} OUTPUT ---")
    print(output)
