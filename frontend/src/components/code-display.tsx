"use client"

import { useMemo } from "react"

export type DetectedFunction = {
  kind: "function" | "class"
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
  const functions = useMemo<DetectedFunction[]>(() => {
    const trimmed = code.trim()
    if (!trimmed) return []

    const lines = code.split("\n")

    const getIndent = (s: string) => {
      const expanded = s.replace(/\t/g, "    ")
      const match = expanded.match(/^\s*/)
      return match ? match[0].length : 0
    }

    const isDefLine = (line: string) =>
      /^\s*(async\s+)?def\s+\w+\s*\(/.test(line)

    const getDefName = (line: string) => {
      const m = /^\s*(async\s+)?def\s+(\w+)\s*\(/.exec(line)
      return m ? m[2] : ""
    }

    const isClassLine = (line: string) =>
      /^\s*class\s+\w+\s*(\(|:)/.test(line)

    const getClassName = (line: string) => {
      const m = /^\s*class\s+(\w+)\s*(\(|:)/.exec(line)
      return m ? m[1] : ""
    }

    const result: DetectedFunction[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      let kind: "function" | "class" | null = null
      let name = ""

      if (isDefLine(line)) {
        kind = "function"
        name = getDefName(line) || "<anonymous>"
      } else if (isClassLine(line)) {
        kind = "class"
        name = getClassName(line) || "<anonymous>"
      } else {
        continue
      }

      const baseIndent = getIndent(line)
      const lineStart = i + 1

      let j = i + 1
      let lastBodyLine = lineStart

      while (j < lines.length) {
        const l = lines[j]
        if (l.trim() === "") {
          lastBodyLine = j + 1
          j++
          continue
        }
        const indent = getIndent(l)
        if (indent > baseIndent) {
          lastBodyLine = j + 1
          j++
          continue
        }
        break
      }

      const lineEnd = lastBodyLine
      const fullCode = lines.slice(lineStart - 1, lineEnd).join("\n")

      if (
        !result.some(
          (f) =>
            f.kind === kind &&
            f.name === name &&
            f.lineStart === lineStart &&
            f.lineEnd === lineEnd,
        )
      ) {
        result.push({ kind, name, lineStart, lineEnd, fullCode })
      }
      // keep scanning; inner defs/classes will be picked up when their line is reached
    }

    result.sort((a, b) => a.lineStart - b.lineStart)
    return result
  }, [code])

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

      if (functionOnLine && functionOnLine.name !== "<anonymous>") {
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
          className={`py-1 px-4 transition-colors ${
            isSelectedLine
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
            Found {functions.length} item(s) • Click to select
          </p>
        </div>
      )}
    </div>
  )
}
