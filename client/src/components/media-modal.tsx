import { useEffect } from "react";
import { X } from "lucide-react";

interface MediaModalProps {
  media: {
    id: string;
    url: string;
    alt: string;
  };
  onClose: () => void;
}

export default function MediaModal({ media, onClose }: MediaModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      data-testid="media-modal"
    >
      <div className="relative max-w-7xl max-h-full">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
          data-testid="close-modal"
        >
          <X className="w-6 h-6" />
        </button>
        <img 
          src={media.url}
          alt={media.alt}
          className="max-w-full max-h-full object-contain"
          data-testid="modal-image"
        />
      </div>
    </div>
  );
}
