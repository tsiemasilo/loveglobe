import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface YearSelectorProps {
  onYearSelect: (year: number) => void;
}

const defaultYears = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

export default function YearSelector({ onYearSelect }: YearSelectorProps) {
  const { data: yearsWithMedia = [] } = useQuery<number[]>({
    queryKey: ['/api/years'],
  });

  // Use default years if no media exists yet
  const displayYears = yearsWithMedia.length > 0 ? yearsWithMedia : defaultYears;

  const getCirclePosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total;
    const radius = 180; // Radius for md screens
    const radiusSm = 140; // Radius for smaller screens
    
    const x = Math.cos(angle - Math.PI / 2) * radius;
    const y = Math.sin(angle - Math.PI / 2) * radius;
    const xSm = Math.cos(angle - Math.PI / 2) * radiusSm;
    const ySm = Math.sin(angle - Math.PI / 2) * radiusSm;
    
    return {
      x,
      y,
      xSm,
      ySm,
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Select a Year</h2>
        <p className="text-lg text-muted-foreground">Choose the year to explore your memories</p>
      </div>
      
      <div className="relative mx-auto w-96 h-96 md:w-[500px] md:h-[500px]">
        {/* Central Hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg z-10">
          <Calendar className="w-8 h-8 text-primary-foreground" />
        </div>

        {/* Year Items in Circle */}
        {displayYears.map((year, index) => {
          const position = getCirclePosition(index, displayYears.length);
          
          return (
            <motion.button
              key={year}
              className="absolute w-16 h-16 bg-card border-2 border-border rounded-full flex items-center justify-center font-semibold text-sm shadow-md hover:border-primary hover:text-primary hover:shadow-lg transition-all duration-300"
              style={{
                left: `calc(50% + ${position.xSm}px)`,
                top: `calc(50% + ${position.ySm}px)`,
                transform: 'translate(-50%, -50%)',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onYearSelect(year)}
              data-testid={`year-button-${year}`}
            >
              {year}
            </motion.button>
          );
        })}

        {/* Larger screens positioning */}
        <style>{`
          @media (min-width: 768px) {
            ${displayYears.map((year, index) => {
              const position = getCirclePosition(index, displayYears.length);
              return `
                [data-testid="year-button-${year}"] {
                  left: calc(50% + ${position.x}px) !important;
                  top: calc(50% + ${position.y}px) !important;
                }
              `;
            }).join('')}
          }
        `}</style>
      </div>
    </div>
  );
}
