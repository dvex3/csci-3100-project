"use client"

import { useMemo } from "react"

export type DetectedFunction = {
  name: string
  lineStart: number
  lineEnd: number
  fullCode: string
}

interface CodeDisplayProps {
  code: string
  selectedFunction: string | null
  onFunctionClick: (fn: DetectedFunction) => void
}

export function CodeDisplay({
  code,
  selectedFunction,
  onFunctionClick,
}: CodeDisplayProps) {
  /**
   * Parse the code to find all functions and their line ranges + full code
   * For JS/TS, this uses a simple brace counter to extend from the line
   * where the function is declared down to the matching closing brace.
   * For Python/others, it just takes lines until indentation decreases or is blank.
   */
  const functions = useMemo(() => {
    const functionList: DetectedFunction[] = []
    const lines = code.split("\n")

    const functionPatterns = [
      /^\s*(async\s+)?function\s+(\w+)\s*\(/, // function foo(...)
      /^\s*(export\s+)?(async\s+)?function\s+(\w+)/, // export function foo
      /^\s*const\s+(\w+)\s*=\s*(async\s*)?\(/, // const foo = (...) =>
      /^\s*let\s+(\w+)\s*=\s*(async\s*)?\(/,
      /^\s*var\s+(\w+)\s*=\s*(async\s*)?\(/,
      /^\s*def\s+(\w+)\s*\(/, // Python def foo(
      /^\s*async\s+def\s+(\w+)\s*\(/,
      /^\s*(public|private|protected)?\s+(static\s+)?(async\s+)?(\w+)\s+(\w+)\s*\(/, // Java method
    ]

    const getIndent = (s: string) => s.match(/^\s*/)?.[0].length ?? 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      for (const pattern of functionPatterns) {
        const match = line.match(pattern)
        if (!match) continue

        let functionName = ""

        if (pattern.source.includes("def")) {
          // Python: def foo( / async def foo(
          functionName = match[1]
        } else if (pattern.source.includes("public|private")) {
          // Java: method name is group 5
          functionName = match[5] || match[3]
        } else {
          // JS/TS: group 2 or 1
          functionName = (match[2] as string) || (match[1] as string) || ""
        }

        if (!functionName) continue

        // Avoid duplicates for same name
        if (functionList.some((f) => f.name === functionName)) continue

        let lineStart = i + 1
        let lineEnd = lineStart

        // Try to expand block for JS/TS/Java using braces
        if (line.includes("{")) {
          let braceCount = 0
          for (let j = i; j < lines.length; j++) {
            const l = lines[j]
            for (const ch of l) {
              if (ch === "{") braceCount++
              if (ch === "}") braceCount--
            }
            if (braceCount === 0) {
              lineEnd = j + 1
              break
            }
          }
        } else if (pattern.source.includes("def")) {
          // Very simple Python heuristic: extend while indentation is greater
          const baseIndent = getIndent(line)
          let lastNonEmpty = i + 1
          for (let j = i + 1; j < lines.length; j++) {
            const l = lines[j]
            if (l.trim() === "") {
              lastNonEmpty = j + 1
              continue
            }
            const indent = getIndent(l)
            if (indent <= baseIndent) break
            lastNonEmpty = j + 1
          }
          lineEnd = lastNonEmpty
        }

        const fullCode = lines.slice(lineStart - 1, lineEnd).join("\n")

        functionList.push({
          name: functionName,
          lineStart,
          lineEnd,
          fullCode,
        })

        // Stop checking other patterns for this line once matched
        break
      }
    }

    return functionList
  }, [code])

  /**
   * Render code with preserved indentation and clickable function names
   */
  const renderCode = useMemo(() => {
    const lines = code.split("\n")

    return lines.map((line, index) => {
      const lineNumber = index + 1
      const functionOnLine = functions.find(
        (f) => f.lineStart === lineNumber,
      )
      const isSelectedLine =
        functionOnLine && functionOnLine.name === selectedFunction

      let before = line
      let namePart: string | null = null
      let after = ""

      if (functionOnLine) {
        const name = functionOnLine.name
        const pos = line.indexOf(name)
        if (pos !== -1) {
          before = line.slice(0, pos)
          namePart = name
          after = line.slice(pos + name.length)
        }
      }

      const isSelectedFunc =
        functionOnLine && selectedFunction === functionOnLine.name

      return (
        <div
          key={index}
          className={`py-1 px-4 transition-colors ${isSelectedLine
            ? "bg-primary/20 border-l-2 border-primary"
            : "hover:bg-muted/50"
            }`}
          onClick={() => {
            if (functionOnLine) {
              onFunctionClick(functionOnLine)
            }
          }}
        >
          <span className="inline-block w-12 text-right text-muted-foreground text-sm pr-4 select-none">
            {lineNumber}
          </span>
          <code className="font-mono text-sm text-foreground whitespace-pre">
            {before}
            {namePart && (
              <span
                className={
                  "inline-block px-1.5 py-0.5 rounded cursor-pointer transition-all " +
                  (isSelectedFunc
                    ? "bg-blue-500 text-white font-semibold shadow-md ring-2 ring-blue-600"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium")
                }
              >
                {namePart}
              </span>
            )}
            {after}
          </code>
        </div>
      )
    })
  }, [code, functions, selectedFunction, onFunctionClick])

  return (
    <div className="w-full overflow-x-auto bg-muted/30 rounded-lg border border-border">
      <div className="max-h-96 overflow-y-auto">
        <div className="font-mono text-sm">{renderCode}</div>
      </div>
      {functions.length > 0 && (
        <div className="px-4 py-2 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Found {functions.length} function(s) • Click to select
          </p>
        </div>
      )}
    </div>
  )
}
