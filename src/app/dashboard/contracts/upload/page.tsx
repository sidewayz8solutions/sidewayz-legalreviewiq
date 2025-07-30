'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import styles from './upload.module.css'

export default function UploadContract() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setFile(file)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    // Use proper UUIDs for demo - in production, get these from auth context
    formData.append('userId', '550e8400-e29b-41d4-a716-446655440000')
    formData.append('organizationId', '550e8400-e29b-41d4-a716-446655440001')

    try {
      const response = await fetch('/api/analyze-contract', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      toast.success('Contract analyzed successfully!')
      router.push(`/dashboard/contracts/${data.contractId}`)
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? String((error as { message?: unknown }).message)
          : 'Failed to analyze contract'
      toast.error(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backButton}>
        <ArrowLeft size={20} />
        Back to Law Review IQ
      </Link>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Upload Contract</h1>
          <p className={styles.subtitle}>
            Upload your contract for AI-powered analysis and risk assessment
          </p>
        </div>

        <div className={styles.uploadCard}>
          {/* Upload area */}
          <div
            className={`${styles.uploadArea} ${dragActive ? styles.active : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {file ? (
              <div className={styles.fileInfo}>
                <FileText className={styles.fileIcon} size={48} />
                <div>
                  <p className={styles.fileName}>{file.name}</p>
                  <p className={styles.fileSize}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className={styles.removeButton}
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div>
                <Upload className={styles.uploadIcon} size={48} />
                <div className={styles.uploadText}>
                  <h3 className={styles.uploadTitle}>Drop your contract here</h3>
                  <p className={styles.uploadDescription}>
                    or click to browse files
                  </p>
                </div>
                <button type="button" className={styles.browseButton}>
                  Browse Files
                </button>
                <p className={styles.uploadHint}>
                  PDF or Word documents (max 10MB)
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className={styles.hiddenInput}
              accept=".pdf,.docx"
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />
          </div>

          {/* Security notice */}
          <div className={styles.securityNotice}>
            <AlertCircle className={styles.securityIcon} size={20} />
            <div className={styles.securityContent}>
              <p className={styles.securityTitle}>Your contracts are secure</p>
              <p className={styles.securityDescription}>
                Files are encrypted in transit and at rest. We delete all documents 30 days after analysis.
              </p>
            </div>
          </div>

          {/* Upload button */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
            className={styles.uploadButton}
          >
            {uploading ? (
              <>
                <div className={styles.loadingSpinner}></div>
                Analyzing contract...
              </>
            ) : (
              'Analyze Contract'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
