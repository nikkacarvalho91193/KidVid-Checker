import { useState, useEffect } from "react";
import { Play, Calendar, User, ShieldCheck, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const analyzingMessages = [
  "Analyzing video content...",
  "Checking for age-appropriate themes...",
  "Scanning metadata...",
  "Evaluating safety indicators...",
  "Almost done...",
];

interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  onAnalyze: (id: string) => void;
  isAnalyzing?: boolean;
}

export function VideoCard({
  id,
  title,
  description,
  thumbnailUrl,
  channelTitle,
  publishedAt,
  onAnalyze,
  isAnalyzing = false,
}: VideoCardProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) {
      setMessageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % analyzingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: isAnalyzing ? 0 : -4 }}
      className={cn(
        "group bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border transition-all duration-300 flex flex-col h-full",
        isAnalyzing 
          ? "border-primary/30 shadow-lg shadow-primary/10" 
          : "border-border/50 hover:shadow-xl hover:border-primary/20"
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={title}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            isAnalyzing ? "scale-105 blur-[2px]" : "group-hover:scale-105"
          )}
          loading="lazy"
        />
        
        {/* Loading Overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/90 flex flex-col items-center justify-center text-white p-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white/30 border-t-white mb-3"
              />
              <motion.div
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs sm:text-sm font-medium text-center"
              >
                {analyzingMessages[messageIndex]}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play Button Overlay (only when not analyzing) */}
        {!isAnalyzing && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-primary ml-0.5" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-sm sm:text-lg leading-tight line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground mb-2 sm:mb-3 flex-wrap">
          <div className="flex items-center gap-1 truncate max-w-[120px] sm:max-w-none">
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{channelTitle}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            {format(new Date(publishedAt), "MMM d, yyyy")}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 flex-grow">
          {description}
        </p>

        <button
          onClick={() => onAnalyze(id)}
          disabled={isAnalyzing}
          className={cn(
            "w-full py-3 sm:py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2",
            isAnalyzing
              ? "bg-primary/20 text-primary cursor-wait"
              : "bg-primary/10 text-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
          )}
          data-testid={`button-analyze-${id}`}
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Analyze Safety
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
