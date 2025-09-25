import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Play, Calendar } from "lucide-react";
import { format } from "date-fns";
import UploadZone from "@/components/upload-zone";
import type { MediaFile } from "@shared/schema";

interface PhotoGalleryProps {
  albumName: string;
  year: number;
  month: number;
  onBackClick: () => void;
  onMediaClick: (media: { id: string; url: string; alt: string }) => void;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function PhotoGallery({ albumName, year, month, onBackClick, onMediaClick }: PhotoGalleryProps) {
  const [showUpload, setShowUpload] = useState(false);
  const queryClient = useQueryClient();

  const { data: mediaFiles = [], isLoading } = useQuery<MediaFile[]>({
    queryKey: ['/api/media', { album: albumName, year, month }],
    queryFn: () => fetch(`/api/media?album=${encodeURIComponent(albumName)}&year=${year}&month=${month}`).then(res => res.json()),
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media', { album: albumName, year, month }] });
      setShowUpload(false);
    },
  });

  const handleUpload = (files: FileList) => {
    const formData = new FormData();
    formData.append('albumName', albumName);
    formData.append('year', year.toString());
    formData.append('month', month.toString());
    
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    
    uploadMutation.mutate(formData);
  };

  const isVideo = (mimeType: string) => {
    return mimeType.startsWith('video/');
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading your memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <button 
          onClick={onBackClick}
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4"
          data-testid="back-to-album-form"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Album Form
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {albumName} — {months[month]} {year}
            </h2>
            <p className="text-muted-foreground" data-testid="photo-count">
              {mediaFiles.length} photos and videos
            </p>
          </div>
          <button 
            onClick={() => setShowUpload(!showUpload)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center space-x-2"
            data-testid="upload-button"
          >
            <Plus className="w-5 h-5" />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      {showUpload && (
        <UploadZone 
          onUpload={handleUpload}
          isUploading={uploadMutation.isPending}
        />
      )}

      {/* Empty State */}
      {mediaFiles.length === 0 && !showUpload && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No memories yet</h3>
          <p className="text-muted-foreground mb-6">
            Start by uploading your first photos and videos for {months[month]} {year}
          </p>
          <button 
            onClick={() => setShowUpload(true)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            data-testid="upload-first-media"
          >
            Upload Your First Media
          </button>
        </div>
      )}

      {/* Photo Grid */}
      {mediaFiles.length > 0 && (
        <div className="masonry-grid">
          {mediaFiles.map((file) => (
            <div key={file.id} className="masonry-item">
              <div 
                className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
                onClick={() => onMediaClick({
                  id: file.id,
                  url: `/api/files/${file.id}`,
                  alt: file.originalName
                })}
                data-testid={`media-item-${file.id}`}
              >
                <img 
                  src={`/api/files/${file.id}`}
                  alt={file.originalName}
                  className="w-full h-auto"
                />
                
                {/* Video play overlay */}
                {isVideo(file.mimeType) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-800 ml-1" />
                    </div>
                  </div>
                )}
                
                <div className="p-3">
                  <p className="text-sm text-muted-foreground">
                    {formatDate(file.uploadedAt.toString())}
                    {isVideo(file.mimeType) && ' • Video'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
