import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";

interface MonthSelectorProps {
  year: number;
  onMonthSelect: (month: number) => void;
  onBackClick: () => void;
}

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function MonthSelector({ year, onMonthSelect, onBackClick }: MonthSelectorProps) {
  const { data: monthsWithMedia = [] } = useQuery<{ month: number; count: number }[]>({
    queryKey: ['/api/years', year, 'months'],
  });

  const getMediaCount = (month: number) => {
    const monthData = monthsWithMedia.find(m => m.month === month);
    return monthData ? monthData.count : 0;
  };

  const getCirclePosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total;
    const radius = 220; // Radius for md screens
    const radiusSm = 160; // Radius for smaller screens
    
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
        <button 
          onClick={onBackClick}
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4"
          data-testid="back-to-years"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Years
        </button>
        <h2 className="text-4xl font-bold mb-4">Select a Month</h2>
        <p className="text-lg text-muted-foreground">
          Choose the month from <span className="text-primary font-semibold">{year}</span>
        </p>
      </div>
      
      <div className="relative mx-auto w-96 h-96 md:w-[600px] md:h-[600px]">
        {/* Central Hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg z-10">
          <Calendar className="w-10 h-10 text-primary-foreground" />
        </div>

        {/* Month Items in Circle */}
        {months.map((month, index) => {
          const position = getCirclePosition(index, months.length);
          const mediaCount = getMediaCount(index);
          
          return (
            <motion.button
              key={month}
              className="absolute w-20 h-20 bg-card border-2 border-border rounded-full flex flex-col items-center justify-center font-semibold text-xs shadow-md hover:border-primary hover:text-primary hover:shadow-lg transition-all duration-300"
              style={{
                left: `calc(50% + ${position.xSm}px)`,
                top: `calc(50% + ${position.ySm}px)`,
                transform: 'translate(-50%, -50%)',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onMonthSelect(index)}
              data-testid={`month-button-${index}`}
            >
              <span>{month}</span>
              <span className="text-[10px] text-muted-foreground">{mediaCount}</span>
            </motion.button>
          );
        })}

        {/* Larger screens positioning */}
        <style>{`
          @media (min-width: 768px) {
            ${months.map((month, index) => {
              const position = getCirclePosition(index, months.length);
              return `
                [data-testid="month-button-${index}"] {
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
