"use client"

import { useState, useEffect } from "react" // ADD useEffect import
import { Button } from "@/src/components/ui/button"
import { Spinner } from "@/src/components/ui/spinner"
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

  // ADD THIS: Reset detailed state when switching functions
  useEffect(() => {
    setDetailedAnnotation(null)
    setIsLoadingSayMore(false) // Optional: Reset loading too
  }, [selectedFunction])

  /**
   * Handles "Say More" button click
   * Sends request to backend asking for more detailed annotation
   * about the selected function
   */

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
          </div>

          {/* Single scrollable area - original + detailed (only when available) */}
          <div className="flex-1 overflow-y-auto bg-muted/30 rounded-lg p-5 space-y-8 font-mono text-sm">
            {/* Original Annotation - always shown first */}
            <div className="text-foreground">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 opacity-80">
                Annotation
              </p>
              <pre className="whitespace-pre-wrap break-words leading-relaxed">
              {typeof annotation === "string" ? annotation : JSON.stringify(annotation, null, 2)}
            </pre>
            </div>

            {/* Detailed Annotation - ONLY shown after "Say More" is clicked and succeeds */}
            {detailedAnnotation && (
                <div className="border-l-4 border-primary pl-5 py-1 bg-primary/5 rounded-r-xl">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span>Detailed Explanation</span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  </p>
                  <pre className="whitespace-pre-wrap break-words text-foreground/95 leading-relaxed">
                {detailedAnnotation}
              </pre>
                </div>
            )}

            {/* Loading indicator while waiting for Say More */}
            {isLoadingSayMore && (
                <div className="flex items-center gap-3 text-muted-foreground py-4">
                  <Spinner className="w-4 h-4 animate-spin" />
                  <span className="text-sm italic">Generating detailed explanation...</span>
                </div>
            )}
          </div>



        </div>
    )
  }

  // Show error state
  return (
      <div className="h-full flex flex-col items-center justify-center text-center gap-4">
        <p className="text-sm text-muted-foreground">No annotation available for this function</p>
      </div>
  )
}