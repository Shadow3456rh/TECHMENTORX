# orchestrator/tool_registry.py

def get_tools_for_test(test_type: str):
    """
    Decide tools based on test type.
    User never selects tools manually.
    """
    test_type = test_type.lower()

    if test_type == "network_scan":
        return ["nmap"]

    if test_type == "web_scan":
        return ["nikto"]

    if test_type == "full_scan":
        return ["nmap", "nikto"]

    raise ValueError(f"Unsupported test type: {test_type}")
