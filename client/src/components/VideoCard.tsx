import { Play, Calendar, User, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
            <Play className="w-5 h-5 text-primary ml-1" />
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {channelTitle}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(publishedAt), "MMM d, yyyy")}
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
          {description}
        </p>

        <button
          onClick={() => onAnalyze(id)}
          disabled={isAnalyzing}
          className={cn(
            "w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2",
            isAnalyzing
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary/10 text-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/25"
          )}
          data-testid={`button-analyze-${id}`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Analyzing Safety...
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
