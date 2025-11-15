"use client"

import { useState } from "react"
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

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
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
          
          <div className="flex flex-col gap-6 h-[calc(100vh-200px)]">
            {/* Top Panel: Code Display - takes full width and flexible height */}
            <Card className="p-4 flex-1 overflow-hidden flex flex-col">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Source Code</h2>
              <div className="flex-1 overflow-auto">
              <CodeDisplay
                code={uploadedCode}
                selectedFunction={selectedFunction}
                onFunctionClick={setSelectedFunction}
              />
              </div>
            </Card>

             {/* Bottom Panel: Annotations - like command window */}
            <Card className="p-4 h-64 flex flex-col border-t-2 border-muted">
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
      </div>
    </main>
  )
}
