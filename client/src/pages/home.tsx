import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import AlbumForm from "@/components/album-form";
import PhotoGallery from "@/components/photo-gallery";
import MediaModal from "@/components/media-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Camera, Plus, FolderOpen, CheckCircle } from "lucide-react";

interface AlbumSelection {
  albumName: string;
  year: number;
  month: number;
}

type WorkflowStep = 'choose' | 'list' | 'form' | 'gallery';

export default function Home() {
  const [step, setStep] = useState<WorkflowStep>('choose');
  const [selectedAlbumName, setSelectedAlbumName] = useState<string>("");
  const [albumSelection, setAlbumSelection] = useState<AlbumSelection | null>(null);
  const [modalMedia, setModalMedia] = useState<{ id: string; url: string; alt: string } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const albumsQuery = useQuery({
    queryKey: ['/api/albums'],
    enabled: step === 'list',
  });

  const handleCreateNew = () => {
    setSelectedAlbumName("");
    setStep('form');
  };

  const handleUseExisting = () => {
    setStep('list');
  };

  const handleAlbumSelect = (albumName: string) => {
    setSelectedAlbumName(albumName);
    setStep('form');
  };

  const handleAlbumFormSubmit = (albumName: string, year: number, month: number) => {
    setAlbumSelection({ albumName, year, month });
    setShowSuccessModal(true);
  };

  const handleSuccessModalContinue = () => {
    setShowSuccessModal(false);
    setStep('gallery');
  };

  const handleSuccessModalGoBack = () => {
    setShowSuccessModal(false);
    setStep('choose');
    setSelectedAlbumName("");
    setAlbumSelection(null);
  };

  const handleBackToChoose = () => {
    setStep('choose');
    setSelectedAlbumName("");
    setAlbumSelection(null);
  };

  const handleBackToList = () => {
    setStep('list');
    setSelectedAlbumName("");
  };

  const handleMediaClick = (media: { id: string; url: string; alt: string }) => {
    setModalMedia(media);
  };

  const handleCloseModal = () => {
    setModalMedia(null);
  };

  const renderChooseStep = () => (
    <div className="max-w-2xl mx-auto px-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Memory Circle</h1>
        <p className="text-lg text-muted-foreground">
          How would you like to manage your photos?
        </p>
      </div>
      
      <div className="grid gap-4">
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={handleCreateNew}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Plus className="w-8 h-8 text-primary" />
              <div>
                <CardTitle>Create New Album</CardTitle>
                <CardDescription>Start a fresh album for your memories</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={handleUseExisting}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FolderOpen className="w-8 h-8 text-primary" />
              <div>
                <CardTitle>Use Existing Album</CardTitle>
                <CardDescription>Add photos to an album you've already created</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          onClick={handleCreateNew}
          data-testid="button-create-new"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Album
        </Button>
        <Button 
          variant="outline" 
          onClick={handleUseExisting}
          className="ml-4"
          data-testid="button-use-existing"
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Use Existing Album
        </Button>
      </div>
    </div>
  );

  const renderListStep = () => {
    const albums = albumsQuery.data as string[] || [];
    
    return (
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Select Existing Album</h1>
          <p className="text-lg text-muted-foreground">
            Choose from your existing albums
          </p>
        </div>
        
        {albumsQuery.isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading albums...</p>
          </div>
        )}
        
        {!albumsQuery.isLoading && albums.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4" data-testid="list-empty-state">
                No albums found. Create your first album!
              </p>
              <Button onClick={handleCreateNew}>Create New Album</Button>
            </CardContent>
          </Card>
        )}
        
        {!albumsQuery.isLoading && albums.length > 0 && (
          <div className="space-y-2">
            {albums.map((albumName) => (
              <Card 
                key={albumName} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleAlbumSelect(albumName)}
                data-testid={`button-album-${albumName.replace(/[^a-zA-Z0-9]/g, '-')}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-6 h-6 text-primary" />
                    <span className="font-medium">{albumName}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-8 flex gap-4">
          <Button variant="outline" onClick={handleBackToChoose}>
            Back
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Instead
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header onHomeClick={handleBackToChoose} />
      
      <main className="flex-1 py-12">
        {step === 'choose' && renderChooseStep()}
        
        {step === 'list' && renderListStep()}
        
        {step === 'form' && (
          <AlbumForm 
            onSubmit={handleAlbumFormSubmit}
            defaultAlbumName={selectedAlbumName}
            lockAlbumName={!!selectedAlbumName}
          />
        )}
        
        {step === 'gallery' && albumSelection && (
          <PhotoGallery
            albumName={albumSelection.albumName}
            year={albumSelection.year}
            month={albumSelection.month}
            onBackClick={selectedAlbumName ? handleBackToList : handleBackToChoose}
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

      <AlertDialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <AlertDialogTitle>Album Created Successfully!</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Your album "{albumSelection?.albumName}" has been created. Would you like to start uploading photos now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleSuccessModalGoBack}>
              Maybe Later
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSuccessModalContinue}>
              Yes, Upload Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}