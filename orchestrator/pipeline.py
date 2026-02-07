# orchestrator/pipeline.py

from policy.policy_engine import is_target_allowed
from orchestrator.tool_registry import get_tools_for_test
from orchestrator.executor import execute_tool


def run_security_pipeline(config: dict):
    """
    Main orchestration pipeline.
    """

    target = config.get("target")
    test_type = config.get("test_type")

    print("[*] Starting security pipeline")

    # 1️⃣ Policy enforcement
    if not is_target_allowed(target):
        raise PermissionError(f"Target {target} is not allowed by policy")

    print("[+] Target allowed by policy")

    # 2️⃣ Decide tools
    tools = get_tools_for_test(test_type)
    print(f"[+] Tools selected: {tools}")

    results = {}

    # 3️⃣ Execute tools in sequence
    for tool in tools:
        print(f"[>] Executing {tool}")
        output = execute_tool(tool, target)
        results[tool] = output

    print("[✓] Scan completed successfully")

    return results
