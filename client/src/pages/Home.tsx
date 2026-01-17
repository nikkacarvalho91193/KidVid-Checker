import { useState } from "react";
import { useSearchVideos, useAnalyzeVideo } from "@/hooks/use-youtube";
import { VideoCard } from "@/components/VideoCard";
import { AnalysisModal } from "@/components/AnalysisModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { VideoAnalysis } from "@shared/schema";

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState<VideoAnalysis | null>(null);
  
  const searchMutation = useSearchVideos();
  const analyzeMutation = useAnalyzeVideo();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchMutation.mutate({ query, maxResults: 12 });
    }
  };

  const handleAnalyze = (videoId: string) => {
    analyzeMutation.mutate(
      { videoId },
      {
        onSuccess: (data) => setSelectedAnalysis(data),
      }
    );
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 pb-16 pt-12 md:pt-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4"
            >
              Is this video <span className="text-primary">safe for kids?</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Our AI analyzes content instantly to give parents and educators peace of mind.
              Search for any YouTube video to get started.
            </motion.p>

            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSearch}
              className="relative max-w-xl mx-auto"
            >
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Paste a YouTube link or search keywords..."
                  className="pl-12 pr-4 h-14 text-lg rounded-full border-2 border-primary/10 bg-white shadow-lg focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition-all"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  disabled={searchMutation.isPending}
                  className="absolute right-2 top-2 rounded-full h-10 px-6 font-semibold"
                >
                  {searchMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </motion.form>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Results Section */}
      <div className="container mx-auto px-4 mt-8">
        {searchMutation.isError && (
          <div className="max-w-xl mx-auto p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p>Something went wrong. Please try again later.</p>
          </div>
        )}

        {searchMutation.isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-display font-bold">Search Results</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchMutation.data?.map((video) => (
                <VideoCard
                  key={video.id}
                  {...video}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={analyzeMutation.isPending && analyzeMutation.variables?.videoId === video.id}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State / Initial Instructions */}
        {!searchMutation.isSuccess && !searchMutation.isPending && !searchMutation.isError && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12 text-center">
            <div className="p-6 bg-card rounded-2xl border border-border/50">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">1. Search</h3>
              <p className="text-muted-foreground text-sm">Find videos by keyword or paste a direct YouTube link.</p>
            </div>
            <div className="p-6 bg-card rounded-2xl border border-border/50">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">2. Analyze</h3>
              <p className="text-muted-foreground text-sm">Our AI scans metadata, thumbnails, and content patterns.</p>
            </div>
            <div className="p-6 bg-card rounded-2xl border border-border/50">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">3. Decide</h3>
              <p className="text-muted-foreground text-sm">Get a clear safety score, age rating, and content warnings.</p>
            </div>
          </div>
        )}
      </div>

      <AnalysisModal 
        isOpen={!!selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
        analysis={selectedAnalysis}
      />
    </div>
  );
}
