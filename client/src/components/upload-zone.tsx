import { useState, useRef } from "react";
import { Upload } from "lucide-react";

interface UploadZoneProps {
  onUpload: (files: FileList) => void;
  isUploading: boolean;
}

export default function UploadZone({ onUpload, isUploading }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-12 text-center mb-8 transition-all duration-300 ${
        isDragOver ? 'border-primary bg-primary/5' : 'border-border'
      } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid="upload-zone"
    >
      <div className="max-w-md mx-auto">
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Uploading your memories...</h3>
            <p className="text-muted-foreground">Please wait while we process your files</p>
          </>
        ) : (
          <>
            <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drop your photos and videos here</h3>
            <p className="text-muted-foreground mb-4">or click to browse your device</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="file-input"
            />
            <button 
              onClick={handleBrowseClick}
              className="bg-accent text-accent-foreground px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors"
              data-testid="browse-files"
            >
              Browse Files
            </button>
            <p className="text-sm text-muted-foreground mt-4">
              Supports JPEG, PNG, GIF, MP4, MOV, AVI
            </p>
          </>
        )}
      </div>
    </div>
  );
}
