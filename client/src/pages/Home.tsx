import { useState } from "react";
import { useSearchVideos, useAnalyzeVideo, useSearchChannels, useAnalyzeChannel } from "@/hooks/use-youtube";
import { VideoCard } from "@/components/VideoCard";
import { ChannelCard } from "@/components/ChannelCard";
import { AnalysisModal } from "@/components/AnalysisModal";
import { ChannelAnalysisModal } from "@/components/ChannelAnalysisModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Loader2, AlertCircle, Info, Brain, Eye, ShieldAlert, Heart, Shield, CheckCircle2, Zap, Video, Tv } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { VideoAnalysis, ChannelAnalysis } from "@shared/schema";

import childWatchingTvImg from "@assets/child-watching-tv.jpg";
import kidsTabletImg from "@assets/kids-tablet.jpg";
import familyScreenImg from "@assets/family-screen.jpg";

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"video" | "channel">("video");
  const [selectedAnalysis, setSelectedAnalysis] = useState<VideoAnalysis | null>(null);
  const [selectedChannelAnalysis, setSelectedChannelAnalysis] = useState<ChannelAnalysis | null>(null);
  const [channelGrades, setChannelGrades] = useState<Record<string, string>>({});
  
  const searchMutation = useSearchVideos();
  const analyzeMutation = useAnalyzeVideo();
  const channelSearchMutation = useSearchChannels();
  const channelAnalyzeMutation = useAnalyzeChannel();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (searchMode === "video") {
        searchMutation.mutate({ query, maxResults: 12 });
      } else {
        channelSearchMutation.mutate({ query, maxResults: 6 });
      }
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

  const handleAnalyzeChannel = (channelId: string) => {
    channelAnalyzeMutation.mutate(
      { channelId },
      {
        onSuccess: (data) => {
          const result = data as ChannelAnalysis;
          setSelectedChannelAnalysis(result);
          if (result.overallGrade) {
            setChannelGrades(prev => ({ ...prev, [channelId]: result.overallGrade! }));
          }
        },
        onError: () => {},
      }
    );
  };

  const handleSearchAlternative = (alternativeQuery: string) => {
    setQuery(alternativeQuery);
    setSearchMode("video");
    searchMutation.mutate({ query: alternativeQuery, maxResults: 12 });
  };

  const isSearching = searchMode === "video" ? searchMutation.isPending : channelSearchMutation.isPending;

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-accent/5 to-transparent pb-8 sm:pb-12 pt-10 sm:pt-16 md:pt-20">
        {/* Animated floating shapes and photos */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Abstract shape decorations */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-sm"
          />
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-32 right-[15%] w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-accent/25 to-accent/5 rounded-full blur-sm"
          />
          <motion.div
            animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-20 left-[20%] w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400/20 to-green-400/5 rounded-xl blur-sm"
          />
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-32 right-[10%] w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-400/15 to-purple-400/5 rounded-3xl blur-sm"
          />
          
          {/* Floating photo elements - visible on medium screens and up */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.9, scale: 1, y: [0, -10, 0], rotate: [-3, -1, -3] }}
            transition={{ opacity: { duration: 0.5 }, scale: { duration: 0.5 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
            className="hidden md:block absolute top-8 left-[2%] lg:top-16 lg:left-[5%] w-24 h-18 md:w-28 md:h-20 lg:w-32 lg:h-24 xl:w-40 xl:h-28 rounded-xl overflow-hidden shadow-2xl shadow-black/30 border-4 border-white dark:border-gray-800 z-[1]"
          >
            <img src={childWatchingTvImg} alt="" className="w-full h-full object-cover" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.9, scale: 1, y: [0, 12, 0], rotate: [2, 4, 2] }}
            transition={{ opacity: { duration: 0.5, delay: 0.2 }, scale: { duration: 0.5, delay: 0.2 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }, rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}
            className="hidden md:block absolute top-12 right-[2%] lg:top-24 lg:right-[4%] w-24 h-16 md:w-28 md:h-20 lg:w-32 lg:h-22 xl:w-36 xl:h-24 rounded-xl overflow-hidden shadow-2xl shadow-black/30 border-4 border-white dark:border-gray-800 z-[1]"
          >
            <img src={kidsTabletImg} alt="" className="w-full h-full object-cover" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.85, scale: 1, y: [0, -8, 0], rotate: [1, 3, 1] }}
            transition={{ opacity: { duration: 0.5, delay: 0.4 }, scale: { duration: 0.5, delay: 0.4 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }, rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
            className="hidden lg:block absolute bottom-8 left-[3%] lg:bottom-16 lg:left-[8%] w-28 h-20 lg:w-32 lg:h-22 rounded-xl overflow-hidden shadow-2xl shadow-black/30 border-4 border-white dark:border-gray-800 z-[1]"
          >
            <img src={familyScreenImg} alt="" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl sm:rounded-3xl shadow-xl shadow-primary/10 p-6 sm:p-10 md:p-12 text-center relative overflow-hidden">
              {/* Subtle gradient overlay on card */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 pointer-events-none" />
              
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 }}
                  className="mb-4 sm:mb-5"
                >
                  <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm font-medium bg-primary/10 text-primary border-primary/20">
                    <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5" />
                    AI-Powered Safety Analysis
                  </Badge>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-4 sm:mb-5"
                >
                  Is this video{" "}
                  <span className="relative">
                    <span className="text-primary">safe for kids?</span>
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="absolute bottom-0 left-0 h-1 sm:h-1.5 bg-primary/30 rounded-full"
                    />
                  </span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-lg mx-auto"
                >
                  Our AI analyzes YouTube content instantly to give parents and educators peace of mind.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.18 }}
                  className="flex items-center justify-center gap-1 p-1 bg-secondary/50 rounded-full max-w-xs mx-auto mb-6 sm:mb-8"
                >
                  <button
                    type="button"
                    onClick={() => setSearchMode("video")}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      searchMode === "video"
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    data-testid="tab-video-search"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Video Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchMode("channel")}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      searchMode === "channel"
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    data-testid="tab-channel-scan"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    Channel Scan
                  </button>
                </motion.div>

              <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSearch}
                className="relative max-w-lg mx-auto"
              >
                {/* Mobile: Stacked layout */}
                <div className="flex flex-col sm:hidden gap-3">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-all duration-200 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder={searchMode === "video" ? "Search for a video..." : "Search for a channel..."}
                      className="pl-12 pr-4 h-14 text-base rounded-xl border-2 border-primary/20 bg-background shadow-sm focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:shadow-lg focus-visible:shadow-primary/10 transition-all duration-200"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      data-testid="input-search"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSearching}
                    className="w-full h-12 rounded-xl font-semibold text-base bg-primary hover:bg-primary/90 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] transition-all duration-200"
                    data-testid="button-search"
                  >
                    {isSearching ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="w-5 h-5 mr-2" />
                    )}
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>
                
                {/* Desktop: Inline layout */}
                <div className="hidden sm:block relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-all duration-200 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder={searchMode === "video" ? "Paste a YouTube link or search keywords..." : "Search for a YouTube channel..."}
                    className="pl-14 pr-32 h-16 text-lg rounded-full border-2 border-primary/20 bg-background shadow-sm focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:shadow-xl focus-visible:shadow-primary/10 transition-all duration-200"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    disabled={isSearching}
                    className="absolute right-2 top-2 rounded-full h-12 px-6 font-semibold text-base bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] transition-all duration-200"
                  >
                    {isSearching ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>
              </motion.form>
              </div>
            </div>

            {/* Trust indicators below the card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant results</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" />
                <span>Parent approved</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-green-400/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Results Section */}
      <div className="container mx-auto px-3 sm:px-4 mt-6 sm:mt-8">
        {(searchMutation.isError || channelSearchMutation.isError) && (
          <div className="max-w-xl mx-auto p-3 sm:p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3 text-sm sm:text-base">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>Something went wrong. Please try again later.</p>
          </div>
        )}

        {channelAnalyzeMutation.isError && (
          <div className="max-w-xl mx-auto mb-4 p-3 sm:p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3 text-sm sm:text-base" data-testid="error-channel-analysis">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>Channel analysis failed. This can take a while — please try again.</p>
          </div>
        )}

        {searchMode === "video" && searchMutation.isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl sm:text-2xl font-display font-bold">Video Results</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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

        {searchMode === "channel" && channelSearchMutation.isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Tv className="w-5 h-5 text-primary" />
              <h2 className="text-xl sm:text-2xl font-display font-bold">Channel Results</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {channelSearchMutation.data?.map((channel) => (
                <ChannelCard
                  key={channel.channelId}
                  {...channel}
                  onAnalyze={handleAnalyzeChannel}
                  isAnalyzing={channelAnalyzeMutation.isPending && channelAnalyzeMutation.variables?.channelId === channel.channelId}
                  grade={channelGrades[channel.channelId] || null}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State / Initial Instructions */}
        {!searchMutation.isSuccess && !channelSearchMutation.isSuccess && !searchMutation.isPending && !channelSearchMutation.isPending && !searchMutation.isError && !channelSearchMutation.isError && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mt-8 sm:mt-12 text-center px-2 sm:px-0">
            {[
              {
                icon: Search,
                title: "1. Search",
                description: "Find videos by keyword or paste a direct YouTube link.",
                gradient: "from-primary/20 to-primary/5",
                iconBg: "bg-primary/10",
                iconColor: "text-primary",
                delay: 0.1
              },
              {
                icon: Sparkles,
                title: "2. Analyze",
                description: "Our AI scans metadata and content patterns instantly.",
                gradient: "from-accent/20 to-accent/5",
                iconBg: "bg-accent/10",
                iconColor: "text-accent",
                delay: 0.2
              },
              {
                icon: Shield,
                title: "3. Decide",
                description: "Get a clear safety score and age recommendation.",
                gradient: "from-green-400/20 to-green-400/5",
                iconBg: "bg-green-100 dark:bg-green-900/30",
                iconColor: "text-green-600 dark:text-green-400",
                delay: 0.3
              }
            ].map((step) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: step.delay }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-5 sm:p-6 bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 relative overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 ${step.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 ${step.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="font-bold mb-2 text-base sm:text-lg">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* AI Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mt-12 sm:mt-16 px-2 sm:px-0"
        >
          <div className="bg-card border border-border/50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 sm:mb-8 relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Info className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-display font-bold">How Our AI Works</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Understanding our safety analysis process</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base mb-1">What We Analyze</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Our AI examines video titles, descriptions, channel information, and available metadata to assess content appropriateness.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base mb-1">AI-Powered Detection</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      We use advanced language models to identify potentially concerning themes, language, and content patterns.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base mb-1">Limitations to Know</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      AI cannot watch the actual video content. It relies on text metadata, which may not capture everything in the video itself.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center text-rose-600 dark:text-rose-400 flex-shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base mb-1">Your Judgment Matters</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      This tool is a helpful starting point, but nothing replaces a parent's judgment and knowing what's right for your child.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-secondary/40 to-secondary/20 rounded-xl p-4 sm:p-5 border border-secondary/50 relative z-10">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed" data-testid="text-disclaimer">
                <strong className="text-foreground">Important:</strong> This tool provides AI-generated suggestions based on limited information. 
                It cannot guarantee complete accuracy and should not be your only source for content decisions. 
                Creators may use misleading titles or descriptions. Always preview content yourself when possible, 
                especially for younger children. Your parental instincts and knowledge of your child are irreplaceable.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <AnalysisModal 
        isOpen={!!selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
        analysis={selectedAnalysis}
        onSearchAlternative={handleSearchAlternative}
      />

      <ChannelAnalysisModal
        isOpen={!!selectedChannelAnalysis}
        onClose={() => setSelectedChannelAnalysis(null)}
        analysis={selectedChannelAnalysis}
      />
    </div>
  );
}
