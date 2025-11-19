"use client"

import { useMemo } from "react"

/**
 * CODE DISPLAY COMPONENT
 *
 * This component:
 * 1. Displays the uploaded code with syntax highlighting
 * 2. Detects functions in the code
 * 3. Makes function names clickable
 * 4. Highlights the selected function
 *
 * Props:
 * - code: The source code string to display
 * - selectedFunction: The name of the currently selected function
 * - onFunctionClick: Callback when user clicks a function name
 */
interface CodeDisplayProps {
  code: string
  selectedFunction: string | null
  onFunctionClick: (functionName: string) => void
}

export function CodeDisplay({ code, selectedFunction, onFunctionClick }: CodeDisplayProps) {
  /**
   * Parses the code to find all functions and their line numbers
   * Supports: JavaScript/TypeScript, Python, Java, C++, etc.
   *
   * Returns: Array of { name: string, lineStart: number, lineEnd: number }
   */
  const functions = useMemo(() => {
    const functionList: Array<{ name: string; lineStart: number; lineEnd: number }> = []
    const lines = code.split("\n")

    // Regex patterns for different function definitions
    // Matches: function foo(), const foo = (), def foo():, etc.
    const functionPatterns = [
      /^\s*(async\s+)?function\s+(\w+)\s*\(/, // function declaration
      /^\s*(export\s+)?(async\s+)?function\s+(\w+)/, // exported function
      /^\s*const\s+(\w+)\s*=\s*(async\s*)?\(/, // arrow function const
      /^\s*let\s+(\w+)\s*=\s*(async\s*)?\(/, // arrow function let
      /^\s*var\s+(\w+)\s*=\s*(async\s*)?\(/, // arrow function var
      /^\s*def\s+(\w+)\s*\(/, // Python function
      /^\s*async\s+def\s+(\w+)\s*\(/, // Python async function
      /^\s*(public|private|protected)?\s+(static\s+)?(async\s+)?(\w+)\s+(\w+)\s*\(/, // Java method
    ]

    lines.forEach((line, index) => {
      for (const pattern of functionPatterns) {
        const match = line.match(pattern)
        if (match) {
          // Extract function name from regex groups
          let functionName = ""
          if (pattern.source.includes("def")) {
            functionName = match[1]
          } else if (pattern.source.includes("public|private")) {
            functionName = match[5] || match[3]
          } else {
            functionName = match[2] || match[1] || ""
          }

          if (functionName && !functionList.some((f) => f.name === functionName)) {
            functionList.push({
              name: functionName,
              lineStart: index + 1,
              lineEnd: index + 1, // Simple version - just marks the definition line
            })
          }
        }
      }
    })

    return functionList
  }, [code])

  /**
   * Highlights lines and makes functions clickable
   * Wraps each line in a <span> and detects if it contains a function name
   */
  const renderCode = useMemo(() => {
    const lines = code.split("\n")

    return lines.map((line, index) => {
      const lineNumber = index + 1
      const functionOnLine = functions.find((f) => f.lineStart === lineNumber)
      const isSelected = functionOnLine && functionOnLine.name === selectedFunction

      // Check if this line contains a selected function name
      let displayLine = line

if (functionOnLine) {
  const isSelected = selectedFunction === functionOnLine.name

  displayLine = line.replace(
    functionOnLine.name,
    `<span 
      class="function-name inline-block px-1.5 py-0.5 rounded cursor-pointer transition-all
             ${isSelected 
               ? 'bg-blue-500 text-white font-semibold shadow-md ring-2 ring-blue-600' 
               : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium'
             }"
      data-function="${functionOnLine.name}"
    >
      ${functionOnLine.name}
    </span>`
  )
}

      return (
        <div
          key={index}
          className={`py-1 px-4 transition-colors ${
            isSelected ? "bg-primary/20 border-l-2 border-primary" : "hover:bg-muted/50"
          }`}
          onClick={() => {
            if (functionOnLine) {
              onFunctionClick(functionOnLine.name)
            }
          }}
        >
          <span className="inline-block w-12 text-right text-muted-foreground text-sm pr-4 select-none">
            {lineNumber}
          </span>
          <code className="font-mono text-sm text-foreground" dangerouslySetInnerHTML={{ __html: displayLine }} />
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
          <p className="text-xs text-muted-foreground">Found {functions.length} function(s) • Click to select</p>
        </div>
      )}
    </div>
  )
}
