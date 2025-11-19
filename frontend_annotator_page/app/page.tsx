"use client"

import { useState, useRef, useEffect } from "react"
import { CodeUploader } from "@/components/code-uploader"
import { CodeDisplay } from "@/components/code-display"
import { AnnotationPanel } from "@/components/annotation-panel"
import { Card } from "@/components/ui/card"

/**
 * Main Annotator Page
 *
 * This is the main page component that orchestrates the entire annotation workflow.
 * It manages:
 * - uploadedCode: The source code uploaded by the user
 * - selectedFunction: Which function is currently selected
 * - annotations: The annotation data received from the backend
 *
 * The page is split into two main sections:
 * 1. Left side: Code display with clickable functions
 * 2. Right side: Annotation panel showing details and "say more" option
 */
export default function Home() {
  // State for uploaded code content
  const [uploadedCode, setUploadedCode] = useState<string>("")

  // State for which function the user clicked on
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null)

  // State for all annotations received from backend
  const [annotations, setAnnotations] = useState<Record<string, any> | null>(null)

  // State for tracking if we're waiting for backend response
  const [isLoading, setIsLoading] = useState(false)

  // NEW: State for panel heights (in percentage for responsiveness)
  const [topPanelHeight, setTopPanelHeight] = useState(70) // Initial: 70% top, 30% bottom

  // NEW: Refs for drag handling
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  /**
   * Handles file upload from CodeUploader component
   * This function:
   * 1. Receives the code content from the file
   * 2. Sends it to the backend API for annotation
   * 3. Stores the response in state
   */
  const handleCodeUpload = async (code: string) => {
    setUploadedCode(code)
    setIsLoading(true)

    try {
      // Send code to backend for annotation
      const response = await fetch("/api/annotate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error("Failed to get annotations")
      }

      const data = await response.json()
      setAnnotations(data) // data should contain function annotations
    } catch (error) {
      console.error("Error uploading code:", error)
      alert("Error processing code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Gets the current annotation for the selected function
   * This function looks up the annotation data for the selected function
   */
  const getCurrentAnnotation = () => {
    if (!selectedFunction || !annotations) return null
    return annotations[selectedFunction]
  }

  // NEW: Handle mouse move for resizing
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const newHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100

    // Clamp between 20% and 80% for usability
    setTopPanelHeight(Math.max(20, Math.min(80, newHeight)))
  }

  // NEW: Handle mouse up to stop dragging
  const handleMouseUp = () => {
    isDragging.current = false
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  // NEW: Start dragging on divider mouse down
  const handleMouseDown = () => {
    isDragging.current = true
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  // NEW: Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto relative"> {/* Make relative for absolute positioning */}
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">AI Code Annotator</h1>
          <p className="text-muted-foreground">
            Upload your code and click on functions to see AI-generated annotations
          </p>
        </div>

        {/* If no code uploaded yet, show upload section */}
        {!uploadedCode ? (
          <div className="flex justify-center items-center min-h-96">
            <CodeUploader onCodeUpload={handleCodeUpload} isLoading={isLoading} />
          </div>
        ) : (
          <div
            ref={containerRef}
            className="flex flex-col gap-0 h-[calc(100vh-200px)]" // Remove gap, make full height
          >
            {/* Top Panel: Code Display - dynamic height */}
            <Card
              className="p-4 overflow-hidden flex flex-col rounded-b-none border-b-0" // Seamless connection
              style={{ height: `${topPanelHeight}%` }}
            >
              <h2 className="text-lg font-semibold mb-4 text-foreground">Source Code</h2>
              <div className="flex-1 overflow-auto">
                <CodeDisplay
                  code={uploadedCode}
                  selectedFunction={selectedFunction}
                  onFunctionClick={setSelectedFunction}
                />
              </div>
            </Card>

            {/* Resizer Divider */}
            <div
              className="h-2 bg-transparent hover:bg-primary/20 cursor-row-resize transition-colors relative group"
              onMouseDown={handleMouseDown}
            >
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-border/50 group-hover:bg-primary/50 transition-colors rounded-full" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-muted-foreground/40 group-hover:bg-primary/60 rounded-full transition-colors" />
            </div>

            {/* Bottom Panel: Annotations - remaining height */}
            <Card
              className="p-4 flex flex-col rounded-t-none"
              style={{ height: `${100 - topPanelHeight}%` }}
            >
              <AnnotationPanel
                annotation={getCurrentAnnotation()}
                selectedFunction={selectedFunction}
                isLoading={isLoading}
                onUploadNew={() => {
                  setUploadedCode("")
                  setSelectedFunction(null)
                  setAnnotations(null)
                }}
              />
            </Card>
          </div>
        )}

        {/* Re-upload Button - Always at bottom-right of the main container */}
        {uploadedCode && (
          <button
            onClick={() => {
              setUploadedCode("")
              setSelectedFunction(null)
              setAnnotations(null)
            }}
            className="fixed bottom-6 right-6 z-50 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg shadow-lg hover:bg-primary/90 transition-all font-medium text-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Re-upload Code
          </button>
        )}
      </div>
    </main>
  )
}
