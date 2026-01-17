import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Shield, Baby, Tag } from "lucide-react";
import type { VideoAnalysis } from "@shared/schema";
import { cn } from "@/lib/utils";

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: VideoAnalysis | null;
}

export function AnalysisModal({ isOpen, onClose, analysis }: AnalysisModalProps) {
  if (!analysis) return null;

  const isSafe = analysis.isAppropriate;
  const confidence = analysis.confidenceScore || 0;
  
  // Determine color theme based on safety and age rating
  const getTheme = () => {
    if (!isSafe) return "destructive";
    if (analysis.ageRating === "13+") return "warning";
    return "safe";
  };
  
  const theme = getTheme();
  
  const StatusIcon = isSafe ? CheckCircle : XCircle;
  const statusColor = isSafe ? "text-green-600 bg-green-50 border-green-200" : "text-red-600 bg-red-50 border-red-200";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-hidden border-0 p-0 sm:rounded-3xl">
        {/* Header Section with Dynamic Color */}
        <div className={cn(
          "px-6 py-8 relative overflow-hidden",
          isSafe ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-red-500 to-rose-600"
        )}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[length:20px_20px]" />
          
          <div className="relative z-10 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm px-3 py-1">
                Safety Analysis Report
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm px-3 py-1">
                {confidence}% Confidence
              </Badge>
            </div>
            
            <h2 className="text-3xl font-display font-bold mb-2 flex items-center gap-3">
              {isSafe ? "Content Appears Safe" : "Content May Be Unsafe"}
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <StatusIcon className="w-8 h-8" />
              </div>
            </h2>
            <p className="text-white/90 text-lg">
              {analysis.title}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 bg-background space-y-6">
          {/* Reasoning Card */}
          <div className="bg-card border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Safety Reasoning
            </h3>
            <p className="text-foreground leading-relaxed">
              {analysis.reasoning}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Age Rating */}
            <div className="bg-secondary/30 rounded-2xl p-4 border border-secondary/50">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                <Baby className="w-4 h-4" />
                Age Rating
              </h4>
              <div className="text-2xl font-display font-bold text-foreground">
                {analysis.ageRating || "Not Rated"}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-secondary/30 rounded-2xl p-4 border border-secondary/50">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Detected Themes
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.tags?.map((tag, i) => (
                  <Badge key={i} variant="outline" className="bg-white">
                    {tag}
                  </Badge>
                )) || <span className="text-sm text-muted-foreground">No tags detected</span>}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
