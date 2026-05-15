'use client'

import { useState, useRef } from 'react'
import { useStore } from '@/lib/store'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatFileSize, formatRelativeTime, truncateText } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  Upload,
  Search,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileCode,
  File,
  Folder,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  Loader2,
  AlertTriangle,
  X,
} from 'lucide-react'

const folderFilters = [
  { value: 'all', label: 'All Documents', icon: FileText },
  { value: 'M&A', label: 'M&A', icon: Folder },
  { value: 'Regulatory', label: 'Regulatory', icon: Folder },
  { value: 'IT Security', label: 'IT Security', icon: Folder },
  { value: 'HR & Employment', label: 'HR & Employment', icon: Folder },
  { value: 'IP & Patents', label: 'IP & Patents', icon: Folder },
]

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return FileText
  if (type.includes('spreadsheet') || type.includes('excel')) return FileSpreadsheet
  if (type.includes('image')) return FileImage
  if (type.includes('code') || type.includes('text')) return FileCode
  return File
}

export default function DocumentsPage() {
  const { documents } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [folderFilter, setFolderFilter] = useState('all')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredDocuments = documents
    .filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesFolder = folderFilter === 'all' || doc.folder === folderFilter
      return matchesSearch && matchesFolder
    })

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Documents</h1>
          <p className="text-sm text-text-muted">Upload, process, and manage legal documents</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <button onClick={handleUpload} className="btn-primary flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="glass-panel p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />
              <span className="text-sm text-text-primary">Uploading documents...</span>
            </div>
            <span className="text-sm text-text-muted">{uploadProgress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill bg-primary-500"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Folder Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {folderFilters.map((folder) => {
          const Icon = folder.icon
          return (
            <button
              key={folder.value}
              onClick={() => setFolderFilter(folder.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                folderFilter === folder.value
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                  : 'bg-surface-elevated text-text-muted border border-border hover:border-border-light hover:text-text-secondary'
              )}
            >
              <Icon className="w-4 h-4" />
              {folder.label}
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search documents by name or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-dark w-full pl-10"
        />
      </div>

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => {
          const FileIcon = getFileIcon(doc.type)
          return (
            <div key={doc.id} className="glass-panel p-5 card-hover group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center">
                    <FileIcon className="w-5 h-5 text-primary-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{doc.name}</p>
                    <p className="text-xs text-text-muted">{formatFileSize(doc.size)}</p>
                  </div>
                </div>
                <StatusBadge status={doc.status} />
              </div>

              {doc.summary && (
                <p className="text-xs text-text-muted mb-3 line-clamp-2">{doc.summary}</p>
              )}

              <div className="flex flex-wrap gap-1.5 mb-4">
                {doc.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-surface-hover rounded-md text-[10px] text-text-muted border border-border">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span>{formatRelativeTime(doc.uploadedAt)}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-accent-rose/10 text-text-muted hover:text-accent-rose transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-muted">No documents found matching your criteria</p>
        </div>
      )}
    </DashboardLayout>
  )
}
