"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ChevronUp } from "lucide-react"

/**
 * ANNOTATION PANEL COMPONENT
 *
 * This component:
 * 1. Displays annotations for the selected function (like VSCode command window)
 * 2. Shows "Say More" button to request more detailed annotations
 * 3. Handles the "say more" request to backend
 *
 * Props:
 * - annotation: The annotation data object for the selected function
 * - selectedFunction: The name of the selected function (for context)
 * - isLoading: Shows loading state while waiting for response
 * - onUploadNew: Callback to upload a new file
 */
interface AnnotationPanelProps {
  annotation: any
  selectedFunction: string | null
  isLoading: boolean
  onUploadNew: () => void
}

export function AnnotationPanel({ annotation, selectedFunction, isLoading, onUploadNew }: AnnotationPanelProps) {
  const [detailedAnnotation, setDetailedAnnotation] = useState<string | null>(null)
  const [isLoadingSayMore, setIsLoadingSayMore] = useState(false)

  /**
   * Handles "Say More" button click
   * Sends request to backend asking for more detailed annotation
   * about the selected function
   */
  const handleSayMore = async () => {
    if (!selectedFunction || !annotation) return

    setIsLoadingSayMore(true)
    try {
      // Send request to backend for more detailed annotation
      const response = await fetch("/api/say-more", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          functionName: selectedFunction,
          currentAnnotation: annotation,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get more details")
      }

      const data = await response.json()
      setDetailedAnnotation(data.detailedAnnotation || data.details)
    } catch (error) {
      console.error("Error getting more details:", error)
      alert("Failed to get more details. Please try again.")
    } finally {
      setIsLoadingSayMore(false)
    }
  }

  // Show empty state if no function is selected
  if (!selectedFunction) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <ChevronUp className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground mb-1">No Function Selected</p>
          <p className="text-sm text-muted-foreground">Click on a function in the code to view its annotation</p>
        </div>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <Spinner />
        <p className="text-sm text-muted-foreground">Getting annotations...</p>
      </div>
    )
  }

  // Show annotation data
  if (annotation) {
    return (
      <div className="h-full flex flex-col gap-4">
        {/* Header with function name */}
        <div className="border-b border-border pb-4">
          <h3 className="text-lg font-semibold text-foreground">{selectedFunction}()</h3>
          <p className="text-xs text-muted-foreground mt-1">Annotation</p>
        </div>

        {/* Annotation content */}
        <div className="flex-1 overflow-y-auto bg-muted/30 rounded-lg p-4 font-mono text-sm text-foreground">
          {/* Display annotation - handle different data formats */}
          {typeof annotation === "string" ? (
            <pre className="whitespace-pre-wrap wrap-break-word">{annotation}</pre>
          ) : (
            <pre className="whitespace-pre-wrap wrap-break-word">{JSON.stringify(annotation, null, 2)}</pre>
          )}
        </div>

        {/* Show detailed annotation if available */}
        {detailedAnnotation && (
          <div className="bg-accent/20 border border-accent rounded-lg p-4 max-h-32 overflow-y-auto">
            <p className="text-xs font-semibold text-accent-foreground mb-2">More Details:</p>
            <p className="text-sm text-foreground whitespace-pre-wrap">{detailedAnnotation}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-4 border-t border-border">
          <Button
            onClick={handleSayMore}
            disabled={isLoadingSayMore}
            variant="outline"
            className="flex-1 bg-transparent"
          >
            {isLoadingSayMore ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Getting details...
              </>
            ) : (
              "Say More"
            )}
          </Button>
          <Button onClick={onUploadNew} variant="outline" className="flex-1 bg-transparent">
            Upload New
          </Button>
        </div>
      </div>
    )
  }

  // Show error state
  return (
    <div className="h-full flex flex-col items-center justify-center text-center gap-4">
      <p className="text-sm text-muted-foreground">No annotation available for this function</p>
      <Button onClick={onUploadNew} variant="outline">
        Upload Another File
      </Button>
    </div>
  )
}
