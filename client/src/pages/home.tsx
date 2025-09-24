import { useState } from "react";
import Header from "@/components/header";
import YearSelector from "@/components/year-selector";
import MonthSelector from "@/components/month-selector";
import PhotoGallery from "@/components/photo-gallery";
import MediaModal from "@/components/media-modal";

type View = 'years' | 'months' | 'gallery';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('years');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [modalMedia, setModalMedia] = useState<{ id: string; url: string; alt: string } | null>(null);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setCurrentView('months');
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    setCurrentView('gallery');
  };

  const handleBackToYears = () => {
    setCurrentView('years');
    setSelectedYear(null);
    setSelectedMonth(null);
  };

  const handleBackToMonths = () => {
    setCurrentView('months');
    setSelectedMonth(null);
  };

  const handleMediaClick = (media: { id: string; url: string; alt: string }) => {
    setModalMedia(media);
  };

  const handleCloseModal = () => {
    setModalMedia(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header onHomeClick={handleBackToYears} />
      
      <main className="flex-1 py-12">
        {currentView === 'years' && (
          <YearSelector onYearSelect={handleYearSelect} />
        )}
        
        {currentView === 'months' && selectedYear && (
          <MonthSelector 
            year={selectedYear}
            onMonthSelect={handleMonthSelect}
            onBackClick={handleBackToYears}
          />
        )}
        
        {currentView === 'gallery' && selectedYear !== null && selectedMonth !== null && (
          <PhotoGallery
            year={selectedYear}
            month={selectedMonth}
            onBackClick={handleBackToMonths}
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
