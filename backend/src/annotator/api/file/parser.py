# backend/src/annotator/api/file/parser.py
# Generated with the help of ChatGpt(5.1)

import ast

def parse_python_file(code: str) -> dict:
    """
    Parse Python source code using AST and return a trimmed parsed_map.
    This is a skeleton placeholder. Actual extraction logic will be implemented later.
    """

    try:
        tree = ast.parse(code)
    except SyntaxError:
        # Return empty structure on failure; annotation should not crash
        return {
            "file": {"path": None, "imports": [], "globals": []},
            "functions": [],
            "call_graph": {}
        }

    # Minimal placeholder parsed_map
    parsed_map = {
        "file": {"path": None, "imports": [], "globals": []},
        "functions": [],     # will be filled with function metadata
        "call_graph": {}     # will be built from functions
    }

    # TODO: Implement actual AST extraction here
    return parsed_map
