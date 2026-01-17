import { useHistory } from "@/hooks/use-youtube";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Filter, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { AnalysisModal } from "@/components/AnalysisModal";
import type { VideoAnalysis } from "@shared/schema";

export default function History() {
  const { data: history, isLoading } = useHistory();
  const [selectedAnalysis, setSelectedAnalysis] = useState<VideoAnalysis | null>(null);
  const [filter, setFilter] = useState<"all" | "safe" | "unsafe">("all");

  const filteredHistory = history?.filter(item => {
    if (filter === "all") return true;
    if (filter === "safe") return item.isAppropriate;
    if (filter === "unsafe") return !item.isAppropriate;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">Analysis History</h1>
          <p className="text-muted-foreground">Review previously analyzed content</p>
        </div>

        <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-xl">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "all" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("safe")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${filter === "safe" ? "bg-white shadow-sm text-green-600" : "text-muted-foreground hover:text-foreground"}`}
          >
            <ShieldCheck className="w-3 h-3" /> Safe
          </button>
          <button
            onClick={() => setFilter("unsafe")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${filter === "unsafe" ? "bg-white shadow-sm text-red-600" : "text-muted-foreground hover:text-foreground"}`}
          >
            <ShieldAlert className="w-3 h-3" /> Unsafe
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHistory?.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedAnalysis(item)}
            className="group bg-card hover:bg-secondary/10 border border-border/50 hover:border-primary/20 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Status Indicator Stripe */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.isAppropriate ? "bg-green-500" : "bg-red-500"}`} />

            <div className="flex gap-4">
              <div className="relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                {item.thumbnailUrl && (
                  <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant={item.isAppropriate ? "secondary" : "destructive"} className="h-5 px-2 text-[10px]">
                    {item.isAppropriate ? "Appropriate" : "Inappropriate"}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.analyzedAt && format(new Date(item.analyzedAt), "MMM d")}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mt-3 pl-2 border-l-2 border-border/50 group-hover:border-primary/20 transition-colors">
              {item.reasoning}
            </p>
          </motion.div>
        ))}
      </div>

      {filteredHistory?.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No history found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or analyze some videos first.</p>
        </div>
      )}

      <AnalysisModal 
        isOpen={!!selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
        analysis={selectedAnalysis}
      />
    </div>
  );
}
