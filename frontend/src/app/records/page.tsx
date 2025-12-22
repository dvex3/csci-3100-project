"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { CodeUploader } from "@/src/components/code-uploader"
import { Card } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"

import { FileApi, type FileInfoResponse } from "@/src/api/generated"
import { apiConfig } from "@/src/utils/api-config"

type FileRecord = FileInfoResponse

export default function RecordsPage() {
  const router = useRouter()
  const [files, setFiles] = useState<FileRecord[]>([])
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)

  // Load past uploads on mount
  useEffect(() => {
    const loadFiles = async () => {
      try {
        setIsLoadingList(true)
        const res = await new FileApi(apiConfig()).getUploadFile()
        const info = res.data.info ?? []
        setFiles(info)
      } catch (err) {
        console.error("Error loading file records:", err)
        alert("Failed to load your past uploads.")
      } finally {
        setIsLoadingList(false)
      }
    }

    loadFiles()
  }, [])

  // Upload new file (uses same backend as /main)
  const handleCodeUpload = async (code: string) => {
    setIsUploading(true)
    try {
      const blob = new Blob([code], { type: "text/plain" })
      const file = new File([blob], "uploaded_code.py")

      const uploadRes = await new FileApi(apiConfig()).postUploadFile(file.name, file)
      const newFile = uploadRes.data
      const uuid = newFile.uuid ?? ""

      if (!uuid) {
        alert("Upload succeeded but no UUID was returned.")
        return
      }

      // Update local list so the new record appears immediately
      setFiles((prev) => [newFile, ...(prev ?? [])])

      // Go to annotation page for this file
      router.push(`/main?file_uuid=${encodeURIComponent(uuid)}`)
    } catch (err) {
      console.error("Error uploading code from records page:", err)
      if (err.status === 400)
        alert("File contains syntax errors.")
      else
        alert("Error uploading code. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleOpenFile = (fileUuid: string | undefined) => {
    if (!fileUuid) {
      alert("Missing file UUID for this record.")
      return
    }
    router.push(`/main?file_uuid=${encodeURIComponent(fileUuid)}`)
  }

  const handleDeleteFile = async (fileUuid: string | undefined) => {
    if (!fileUuid) {
      alert("Missing file UUID for this record.")
      return
    }
    const confirmDelete = window.confirm("Delete this file record?")
    if (!confirmDelete) return

    try {
      setIsDeletingId(fileUuid)
      await new FileApi(apiConfig()).deleteFileAction(fileUuid)
      setFiles((prev) => (prev ?? []).filter((f) => f.uuid !== fileUuid))
    } catch (err) {
      console.error("Error deleting file:", err)
      alert("Failed to delete file. Please try again.")
    } finally {
      setIsDeletingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Your Code Records</h1>
          <p className="text-muted-foreground">
            View your past uploads or upload a new code file to annotate.
          </p>
        </header>

        {/* Upload new file */}
        <section>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">
              Upload New Code File
            </h2>
            <CodeUploader onCodeUpload={handleCodeUpload} isLoading={isUploading} />
          </Card>
        </section>

        {/* Past uploads */}
        <section>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Past Uploads</h2>
              {isLoadingList && (
                <span className="text-xs text-muted-foreground">Loading...</span>
              )}
            </div>

            {files.length === 0 && !isLoadingList && (
              <p className="text-sm text-muted-foreground">
                No past uploads found. Upload a new file above to get started.
              </p>
            )}

            {files.length > 0 && (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {files.map((file) => (
                  <div
                    key={file.uuid}
                    className="flex items-center justify-between border rounded-md px-4 py-2 bg-muted/30"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-foreground">
                        {file.item_name ?? file.file_name ?? "Unnamed file"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        UUID: {file.uuid}
                      </span>
                      {file.created_at && (
                        <span className="text-xs text-muted-foreground">
                          Uploaded at: {file.created_at}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleOpenFile(file.uuid)}
                      >
                        Open
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isDeletingId === file.uuid}
                        onClick={() => handleDeleteFile(file.uuid)}
                      >
                        {isDeletingId === file.uuid ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>
      </div>
    </main>
  )
}
