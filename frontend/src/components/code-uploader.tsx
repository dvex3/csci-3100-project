"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/src/components/ui/button"
import { Card } from "@/src/components/ui/card"
import { Upload } from "lucide-react"

/**
 * CODE UPLOADER COMPONENT
 *
 * This component handles:
 * 1. File input from user (click or drag-and-drop)
 * 2. Reading the file content
 * 3. Passing the content to parent via onCodeUpload callback
 *
 * Props:
 * - onCodeUpload: Function called when code is ready to send to backend
 * - isLoading: Shows loading state while backend processes the code
 */
interface CodeUploaderProps {
  onCodeUpload: (code: string) => void
  isLoading: boolean
}

export function CodeUploader({ onCodeUpload, isLoading }: CodeUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Reads the file and extracts text content
   * Called when user selects file via input or drag-drop
   */
  const handleFileRead = async (file: File) => {
    // Check if file is a text file (common code file extensions)
    const acceptedExtensions = [
      ".py",
    ]

    const isAccepted = acceptedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))

    if (!isAccepted) {
      alert("Please upload a python source file (.py file)")
      return
    }

    // Read file as text
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      onCodeUpload(content)
    }
    reader.readAsText(file)
  }

  /**
   * Handle click on upload button - opens file picker
   */
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  /**
   * Handle file selection from file input
   */
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileRead(file)
    }
  }

  /**
   * Handle drag over - shows visual feedback
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  /**
   * Handle drag leave - removes visual feedback
   */
  const handleDragLeave = () => {
    setIsDragging(false)
  }

  /**
   * Handle drop - reads dropped file
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileRead(file)
    }
  }

  return (
    <Card
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`p-12 text-center border-2 border-dashed cursor-pointer transition-colors ${isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary"
        }`}
    >
      <div className="flex flex-col items-center gap-4">
        <Upload className="w-12 h-12 text-muted-foreground" />
        <div>
          <p className="text-lg font-semibold text-foreground mb-2">Upload Code File</p>
          <p className="text-sm text-muted-foreground mb-4">Drag and drop your code file here, or click to select</p>
          <p className="text-xs text-muted-foreground">
            Only .py accptable now
          </p>
        </div>
        <Button onClick={handleClick} disabled={isLoading} className="mt-4">
          {isLoading ? "Processing..." : "Select File"}
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInput}
        className="hidden"
        accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.go,.rb,.php,.swift,.kt,.rs,.txt"
      />
    </Card>
  )
}
