# backend/src/annotator/api/file/parser.py
# generated with the help of ChatGPT(5.1)

import ast

# ----------------------------
# Helper functions
# ----------------------------

def extract_imports(tree: ast.AST):
    """Collect top-level import and import-from names."""
    imports = []
    for node in tree.body:
        if isinstance(node, ast.Import):
            for n in node.names:
                imports.append(n.name)
        elif isinstance(node, ast.ImportFrom):
            module = node.module if node.module else ""
            imports.append(module)
    return imports


def extract_globals(tree: ast.AST):
    """Collect global variable names used at module level."""
    globals_list = []
    for node in tree.body:
        if isinstance(node, ast.Assign):
            for t in node.targets:
                if isinstance(t, ast.Name):
                    globals_list.append(t.id)
    return globals_list


def extract_returns(func_node: ast.FunctionDef):
    """Return a list of short return expression summaries."""
    returns = []
    for node in ast.walk(func_node):
        if isinstance(node, ast.Return):
            if node.value is None:
                returns.append("None")
            else:
                try:
                    # short unparse (Python 3.9+)
                    expr = ast.unparse(node.value)
                except Exception:
                    expr = "<expr>"
                returns.append(expr)
    return returns


def extract_calls(func_node: ast.FunctionDef):
    """Return list of function names called inside this function."""
    calls = []
    for node in ast.walk(func_node):
        if isinstance(node, ast.Call):
            # Try to extract the call name
            if isinstance(node.func, ast.Name):
                calls.append(node.func.id)
            elif isinstance(node.func, ast.Attribute):
                calls.append(f"{ast.unparse(node.func.value)}.{node.func.attr}")
            else:
                calls.append("<unknown_call>")
    return calls


def detect_control_flow(func_node: ast.FunctionDef):
    """Return booleans for if/while existence."""
    has_if = any(isinstance(n, ast.If) for n in ast.walk(func_node))
    has_while = any(isinstance(n, ast.While) for n in ast.walk(func_node))
    return {"if": has_if, "while": has_while}


def is_recursive(func_name: str, calls: list):
    """True if the function calls itself."""
    return func_name in calls


# ----------------------------
# Main parser
# ----------------------------

def parse_python_file(code: str) -> dict:
    """
    Fully implemented trimmed parsed_map generator.
    Safe, deterministic, LLM-friendly.
    """

    try:
        tree = ast.parse(code)
    except SyntaxError:
        return {
            "file": {"path": None, "imports": [], "globals": []},
            "functions": [],
            "call_graph": {}
        }

    imports = extract_imports(tree)
    globals_list = extract_globals(tree)

    function_entries = []

    # ----------------------------
    # First pass: extract all function-level metadata
    # ----------------------------
    for node in tree.body:
        if isinstance(node, ast.FunctionDef):
            func_name = node.name
            params = [arg.arg for arg in node.args.args]  # simple param list
            returns = extract_returns(node)
            calls = extract_calls(node)
            control_flow = detect_control_flow(node)
            recursion = is_recursive(func_name, calls)

            entry = {
                "name": func_name,
                "start_line": node.lineno,
                "end_line": node.end_lineno if hasattr(node, "end_lineno") else node.lineno,
                "params": params,
                "returns": returns,
                "calls": calls,
                "called_by": [],  # fill in second pass
                "control_flow": control_flow,
                "recursion": recursion
            }
            function_entries.append(entry)

    # ----------------------------
    # Second pass: build call_graph & called_by
    # ----------------------------
    call_graph = {}
    for f in function_entries:
        call_graph[f["name"]] = []

    all_names = {f["name"] for f in function_entries}

    # For each function, add edges for calls to other functions in same file
    for f in function_entries:
        for c in f["calls"]:
            # Only keep calls to functions defined in this same file
            name_only = c.split(".")[-1]  # strip object prefix: obj.method → method
            if name_only in all_names:
                call_graph[f["name"]].append(name_only)

    # called_by : reverse graph
    for f in function_entries:
        for callee in call_graph[f["name"]]:
            for g in function_entries:
                if g["name"] == callee:
                    g["called_by"].append(f["name"])

    # ----------------------------
    # Final parsed_map
    # ----------------------------
    parsed_map = {
        "file": {
            "path": None,
            "imports": imports,
            "globals": globals_list,
        },
        "functions": function_entries,
    }

    # call_graph included
    parsed_map["call_graph"] = call_graph

    return parsed_map
