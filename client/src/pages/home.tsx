import { useState } from "react";
import Header from "@/components/header";
import AlbumForm from "@/components/album-form";
import PhotoGallery from "@/components/photo-gallery";
import MediaModal from "@/components/media-modal";

interface AlbumSelection {
  albumName: string;
  year: number;
  month: number;
}

export default function Home() {
  const [albumSelection, setAlbumSelection] = useState<AlbumSelection | null>(null);
  const [modalMedia, setModalMedia] = useState<{ id: string; url: string; alt: string } | null>(null);

  const handleAlbumFormSubmit = (albumName: string, year: number, month: number) => {
    setAlbumSelection({ albumName, year, month });
  };

  const handleBackToForm = () => {
    setAlbumSelection(null);
  };

  const handleMediaClick = (media: { id: string; url: string; alt: string }) => {
    setModalMedia(media);
  };

  const handleCloseModal = () => {
    setModalMedia(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header onHomeClick={handleBackToForm} />
      
      <main className="flex-1 py-12">
        {!albumSelection && (
          <AlbumForm onSubmit={handleAlbumFormSubmit} />
        )}
        
        {albumSelection && (
          <PhotoGallery
            albumName={albumSelection.albumName}
            year={albumSelection.year}
            month={albumSelection.month}
            onBackClick={handleBackToForm}
            onMediaClick={handleMediaClick}
          />
        )}
      </main>

      {modalMedia && (
        <MediaModal
          media={modalMedia}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}