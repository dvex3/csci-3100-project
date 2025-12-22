from src.annotator.api.file.parser import parse_python_file


# Basic structure + imports/globals + params + returns + calls + graph


def test_parse_python_file_basic_structure():
    code = """
import os

GLOBAL_X = 1

def foo(x, y):
    z = x + y
    return z

def bar():
    if GLOBAL_X > 0:
        foo(1, 2)
    while GLOBAL_X < 10:
        break
    return None
"""

    parsed = parse_python_file(code)

    # Overall structure
    assert isinstance(parsed, dict)
    assert "file" in parsed
    assert "functions" in parsed
    assert "call_graph" in parsed

    # Imports / Globals
    assert parsed["file"]["imports"] == ["os"]
    assert "GLOBAL_X" in parsed["file"]["globals"]

    # Function names
    functions = parsed["functions"]
    names = {f["name"] for f in functions}
    assert names == {"foo", "bar"}

    foo = next(f for f in functions if f["name"] == "foo")
    bar = next(f for f in functions if f["name"] == "bar")

    # Params
    assert foo["params"] == ["x", "y"]
    assert bar["params"] == []

    # Returns
    assert foo["returns"] == ["z"]
    assert bar["returns"] == ["None"]

    # Control flow
    assert foo["control_flow"] == {"if": False, "while": False}
    assert bar["control_flow"]["if"] is True
    assert bar["control_flow"]["while"] is True

    # Calls
    assert any("foo" in c for c in bar["calls"])

    # Call graph
    call_graph = parsed["call_graph"]
    assert "foo" in call_graph
    assert "bar" in call_graph
    assert "foo" in call_graph["bar"]

    # Called_by
    assert "bar" in foo["called_by"]


# Recursion test


def test_parse_python_file_recursion_and_call_graph():
    code = """
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)
"""
    parsed = parse_python_file(code)

    functions = parsed["functions"]
    assert len(functions) == 1
    fib = functions[0]

    # Calls itself
    assert any("fib" in c for c in fib["calls"])
    assert fib["recursion"] is True

    # Call graph consistency
    assert "fib" in parsed["call_graph"]["fib"]
    assert "fib" in fib["called_by"]


# Attribute call test (obj.method())


def test_parse_python_file_attribute_calls():
    code = """
def test():
    obj = 1
    obj.run()
"""
    parsed = parse_python_file(code)

    f = parsed["functions"][0]
    calls = f["calls"]

    # parser must capture "obj.run"
    assert any("obj.run" in c for c in calls)


# Multi-return test


def test_parse_python_file_multiple_returns():
    code = """
def f(x):
    if x > 0:
        return x
    return -x
"""
    parsed = parse_python_file(code)

    f = parsed["functions"][0]
    # returns should contain both branches, unparsed
    assert "x" in f["returns"]
    assert "-x" in f["returns"]
    assert len(f["returns"]) == 2


# Nested function ignored


def test_parse_python_file_nested_functions_ignored():
    code = """
def outer():
    def inner():
        return 1
    return inner()
"""
    parsed = parse_python_file(code)

    functions = parsed["functions"]
    names = {f["name"] for f in functions}

    # parser intentionally ignores nested defs → only outer included
    assert names == {"outer"}


# Syntax error


def test_parse_python_file_syntax_error_returns_none():
    code = """
def broken(
    return 1
"""
    parsed = parse_python_file(code)
    assert parsed is None


# No functions


def test_parse_python_file_no_functions():
    code = """
import math
X = 42
"""
    parsed = parse_python_file(code)

    assert isinstance(parsed, dict)
    assert parsed["file"]["imports"] == ["math"]
    assert "X" in parsed["file"]["globals"]
    assert parsed["functions"] == []
    assert parsed["call_graph"] == {}
