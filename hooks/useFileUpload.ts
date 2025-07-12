import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface UploadResult {
  url: string
  publicId: string
  fileName: string
  fileSize: number
  uploadedAt: string
}

interface UseFileUploadOptions {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  onProgress?: (progress: number) => void
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['application/pdf'],
    onProgress
  } = options

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024))
      return `File size must be less than ${maxSizeMB}MB`
    }

    return null
  }

  const uploadFile = async (file: File): Promise<UploadResult | null> => {
    try {
      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        toast({
          title: "Invalid file",
          description: validationError,
          variant: "destructive",
        })
        return null
      }

      setIsUploading(true)
      setUploadProgress(0)

      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      // Upload to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload file')
      }

      setUploadProgress(100)
      onProgress?.(100)

      const result = await response.json()
      
      toast({
        title: "Upload successful",
        description: "File uploaded successfully",
      })

      return result
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      })
      return null
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const uploadMultipleFiles = async (files: File[]): Promise<UploadResult[]> => {
    const results: UploadResult[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const result = await uploadFile(file)
      
      if (result) {
        results.push(result)
      }
      
      // Update progress for multiple files
      const progress = ((i + 1) / files.length) * 100
      setUploadProgress(progress)
      onProgress?.(progress)
    }
    
    return results
  }

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    uploadProgress,
    validateFile
  }
} 