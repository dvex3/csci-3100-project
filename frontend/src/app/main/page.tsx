"use client"

import { useState, useRef, useEffect } from "react"
import { CodeUploader } from "@/src/components/code-uploader"
import {
  CodeDisplay,
  DetectedFunction,
} from "@/src/components/code-display"
import { AnnotationPanel } from "@/src/components/annotation-panel"
import { Card } from "@/src/components/ui/card"

import { AnnotationApi, FileApi } from "@/src/api/generated"
import { apiConfig } from "@/src/utils/api-config"

export default function Home() {
  const [uploadedCode, setUploadedCode] = useState<string>("")
  const [selectedFunction, setSelectedFunction] =
    useState<DetectedFunction | null>(null)

  // Map: function_name -> annotation text
  const [annotations, setAnnotations] =
    useState<Record<string, string> | undefined>(undefined)

  const [isLoading, setIsLoading] = useState(false)
  const [topPanelHeight, setTopPanelHeight] = useState(70)
  const [currentuuid, setCurrentuuid] = useState<string>("")

  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  // Optional helper: refresh all annotations for a file
  const refreshAnnotations = async (uuid: string) => {
    try {
      const annotationRes =
        await new AnnotationApi(apiConfig()).getGetAnnotation(uuid)

      const info = annotationRes.data.info // AnnotationInfoResponse[] | undefined

      if (info && info.length > 0) {
        const map: Record<string, string> = {}
        for (const item of info) {
          const name = item.function_name
          const text = item.annotation
          if (!name || !text) continue
          map[name] = text
        }
        setAnnotations(map)
      } else {
        setAnnotations(undefined)
      }
    } catch (error) {
      console.error("Error refreshing annotations:", error)
    }
  }

  // Upload code only
  const handleCodeUpload = async (code: string) => {
    setUploadedCode(code)
    setIsLoading(true)

    const blob = new Blob([code], { type: "text/plain" })
    const file = new File([blob], "uploaded_code.tsx")

    try {
      const uploadRes = await new FileApi(apiConfig()).postUploadFile(
        "file",
        file,
      )
      console.log("uploadRes:", uploadRes)
      const uuid = uploadRes.data.uuid ?? ""
      console.log("uploaded file uuid:", uuid)
      setCurrentuuid(uuid)

      setAnnotations(undefined)
      setSelectedFunction(null)
    } catch (error) {
      console.error("Error uploading code:", error)
      alert("Error uploading code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Current annotation text for the selected function
  const getCurrentAnnotation = () => {
    if (!selectedFunction || !annotations) return null
    return annotations[selectedFunction.name] ?? null
  }

  // Resize handlers
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const newHeight = ((e.clientY - rect.top) / rect.height) * 100
    setTopPanelHeight(Math.max(20, Math.min(80, newHeight)))
  }

  const handleMouseUp = () => {
    isDragging.current = false
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const handleMouseDown = () => {
    isDragging.current = true
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            AI Code Annotator
          </h1>
          <p className="text-muted-foreground">
            Upload your code and click on functions to see AI-generated
            annotations
          </p>
        </div>

        {/* Upload or main layout */}
        {!uploadedCode ? (
          <div className="flex justify-center items-center min-h-96">
            <CodeUploader
              onCodeUpload={handleCodeUpload}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div
            ref={containerRef}
            className="flex flex-col gap-0 h-[calc(100vh-200px)]"
          >
            {/* Top: Code */}
            <Card
              className="p-4 overflow-hidden flex flex-col rounded-b-none border-b-0"
              style={{ height: `${topPanelHeight}%` }}
            >
              <h2 className="text-lg font-semibold mb-4 text-foreground">
                Source Code
              </h2>
              <div className="flex-1 overflow-auto">
                <CodeDisplay
                  code={uploadedCode}
                  selectedFunction={selectedFunction?.name ?? null}
                  onFunctionClick={async (fn) => {
                    console.log("clicked function object:", fn)
                    setSelectedFunction(fn)

                    if (!currentuuid) {
                      console.warn(
                        "No currentuuid yet, cannot generate annotation",
                      )
                      return
                    }

                    try {
                      setIsLoading(true)
                      // Send full function code plus file UUID to backend
                      const postRes =
                        await new AnnotationApi(
                          apiConfig(),
                        ).postAnnotate(fn.fullCode, currentuuid)
                      console.log("postAnnotate result:", postRes.data)

                      const text = postRes.data.annotation
                      if (text) {
                        setAnnotations((prev) => ({
                          ...(prev ?? {}),
                          [fn.name]: text,
                        }))
                      }

                      // Optionally sync with backend list:
                      // await refreshAnnotations(currentuuid)
                    } catch (error) {
                      console.error("Error generating annotation:", error)
                      alert(
                        "Error generating annotation. Please try again.",
                      )
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                />
              </div>
            </Card>

            {/* Divider */}
            <div
              className="h-2 bg-transparent hover:bg-primary/20 cursor-row-resize transition-colors relative group"
              onMouseDown={handleMouseDown}
            >
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-border/50 group-hover:bg-primary/50 transition-colors rounded-full" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-muted-foreground/40 group-hover:bg-primary/60 rounded-full transition-colors" />
            </div>

            {/* Bottom: Annotations */}
            <Card
              className="p-4 flex flex-col rounded-t-none"
              style={{ height: `${100 - topPanelHeight}%` }}
            >
              <AnnotationPanel
                annotation={getCurrentAnnotation()}
                selectedFunction={selectedFunction?.name ?? null}
                isLoading={isLoading}
                onUploadNew={() => {
                  setUploadedCode("")
                  setSelectedFunction(null)
                  setAnnotations(undefined)
                  setCurrentuuid("")
                }}
              />
            </Card>
          </div>
        )}

        {/* Re-upload Button */}
        {uploadedCode && (
          <button
            onClick={() => {
              setUploadedCode("")
              setSelectedFunction(null)
              setAnnotations(undefined)
              setCurrentuuid("")
            }}
            className="fixed bottom-6 right-6 z-50 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg shadow-lg hover:bg-primary/90 transition-all font-medium text-sm flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Re-upload Code
          </button>
        )}
      </div>
    </main>
  )
}
