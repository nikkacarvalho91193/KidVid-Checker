import { useState, useEffect } from "react";
import { Users, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const analyzingMessages = [
  "Fetching recent videos...",
  "Analyzing video content...",
  "Checking safety patterns...",
  "Evaluating overstimulation...",
  "Building channel profile...",
  "Synthesizing results...",
  "Almost done...",
];

function formatSubscriberCount(count: string): string {
  const num = parseInt(count);
  if (isNaN(num)) return count;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
}

const gradeColors: Record<string, { bg: string; text: string; border: string }> = {
  A: { bg: "bg-green-100 dark:bg-green-900/40", text: "text-green-700 dark:text-green-300", border: "border-green-300 dark:border-green-700" },
  B: { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300", border: "border-blue-300 dark:border-blue-700" },
  C: { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300", border: "border-amber-300 dark:border-amber-700" },
  D: { bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-700 dark:text-orange-300", border: "border-orange-300 dark:border-orange-700" },
  F: { bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-700 dark:text-red-300", border: "border-red-300 dark:border-red-700" },
};

interface ChannelCardProps {
  channelId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: string;
  onAnalyze: (channelId: string) => void;
  isAnalyzing?: boolean;
  grade?: string | null;
}

export function ChannelCard({
  channelId,
  title,
  description,
  thumbnailUrl,
  subscriberCount,
  onAnalyze,
  isAnalyzing = false,
  grade,
}: ChannelCardProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) {
      setMessageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % analyzingMessages.length);
    }, 3000);
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
      data-testid={`card-channel-${channelId}`}
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 p-6 flex items-center justify-center">
        <img
          src={thumbnailUrl}
          alt={title}
          className={cn(
            "w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg transition-all duration-500",
            isAnalyzing ? "scale-95 opacity-50" : "group-hover:scale-110"
          )}
          loading="lazy"
        />

        {grade && !isAnalyzing && (
          <div className="absolute top-2 right-2 z-10" data-testid={`grade-badge-${channelId}`}>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 shadow-md",
              gradeColors[grade]?.bg || "bg-gray-100",
              gradeColors[grade]?.text || "text-gray-700",
              gradeColors[grade]?.border || "border-gray-300"
            )}>
              {grade}
            </div>
          </div>
        )}

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
      </div>

      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-sm sm:text-lg leading-tight line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 sm:mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 flex-shrink-0" />
            <span>{formatSubscriberCount(subscriberCount)} subscribers</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 flex-grow">
          {description}
        </p>

        <button
          onClick={() => onAnalyze(channelId)}
          disabled={isAnalyzing}
          className={cn(
            "w-full py-3 sm:py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2",
            isAnalyzing
              ? "bg-primary/20 text-primary cursor-wait"
              : "bg-primary/10 text-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
          )}
          data-testid={`button-analyze-channel-${channelId}`}
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Scanning Channel...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Analyze Channel
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
