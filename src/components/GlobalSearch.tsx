"use client";

import { useState, useEffect } from "react";
import { Search, FileText, Memory, Calendar, Activity, Database, Clock, Filter } from "lucide-react";
import { format, subDays, subWeeks, addDays } from "date-fns";

interface SearchResult {
  id: string;
  type: "document" | "memory" | "task" | "activity";
  title: string;
  description: string;
  content: string;
  timestamp: Date;
  category: string;
  relevance: number;
  source: string;
  metadata?: Record<string, any>;
}

// Mock data for search demonstration
const mockDocuments: SearchResult[] = [
  {
    id: "doc-1",
    type: "document",
    title: "Nigeria Printing Business Model",
    description: "Comprehensive business model canvas for printing business in Nigeria",
    content: "Market analysis, competitive positioning, revenue streams, and operational strategy for starting a printing business in the Nigerian market with focus on SME clients and digital-first approach.",
    timestamp: subDays(new Date(), 2),
    category: "business",
    relevance: 0.95,
    source: "business-model-canvas.md",
    metadata: {
      size: "15KB",
      format: "markdown",
      author: "AI Assistant"
    }
  },
  {
    id: "doc-2", 
    type: "document",
    title: "Kimi K2.5 Research Summary",
    description: "Technical specifications and capabilities of NVIDIA Kimi K2.5 model",
    content: "Kimi K2.5 is a 1T parameter multimodal MoE model with native multimodal understanding, thinking mode capabilities, and advanced agentic workflows. Optimized for NVIDIA Hopper architecture with INT4 quantization.",
    timestamp: subDays(new Date(), 1),
    category: "research",
    relevance: 0.88,
    source: "kimmi-research.md",
    metadata: {
      size: "8KB",
      format: "markdown",
      tags: ["AI", "NVIDIA", "Multimodal"]
    }
  },
  {
    id: "doc-3",
    type: "document", 
    title: "Strategic Advisor Framework",
    description: "Business strategy analysis framework for competitive positioning",
    content: "Strategic thinking methodology for evaluating options, analyzing trade-offs, and making high-impact business decisions. Includes situational analysis, option generation, decision criteria, and recommendation frameworks.",
    timestamp: subWeeks(new Date(), 1),
    category: "strategy",
    relevance: 0.82,
    source: "strategy-framework.md",
    metadata: {
      size: "12KB",
      format: "markdown"
    }
  }
];

const mockMemories: SearchResult[] = [
  {
    id: "memory-1",
    type: "memory",
    title: "Wedding Website Project",
    description: "Dionisia & Abiola wedding website development",
    content: "Built premium wedding website using Next.js 14 with Tailwind CSS. Deployed to Vercel at https://danda-wedding-site.vercel.app. Features include Hero section, Story, Venue information, Registry, and RSVP system.",
    timestamp: subDays(new Date(), 5),
    category: "project",
    relevance: 0.90,
    source: "memory/2026-02-04.md",
    metadata: {
      type: "project",
      status: "completed",
      tags: ["wedding", "nextjs", "vercel"]
    }
  },
  {
    id: "memory-2",
    type: "memory",
    title: "Skills Installation Session",
    description: "Installed and configured multiple business development skills",
    content: "Successfully installed strategy-advisor, business-model-canvas, competitive-analysis, project-manager, and competitive-intelligence-market-research skills. All skills are now available for business development workflows.",
    timestamp: subDays(new Date(), 3),
    category: "development",
    relevance: 0.85,
    source: "memory/2026-02-06.md",
    metadata: {
      type: "system",
      tags: ["skills", "business", "development"]
    }
  }
];

const mockTasks: SearchResult[] = [
  {
    id: "task-1",
    type: "task",
    title: "Gmail Configuration Reminder",
    description: "Configure Himalaya for email management",
    content: "Set up OAuth authentication for Gmail access through Himalaya CLI. Configure email management, inbox monitoring, and automated email workflows.",
    timestamp: new Date(),
    category: "communication",
    relevance: 0.92,
    source: "calendar",
    metadata: {
      type: "reminder",
      priority: "high",
      dueDate: new Date()
    }
  },
  {
    id: "task-2",
    type: "task",
    title: "Market Research Analysis",
    description: "Analyze Nigeria printing market data",
    content: "Conduct comprehensive market research for Nigerian printing industry. Include market size estimation, customer segments, competitive landscape, and growth opportunities.",
    timestamp: addDays(new Date(), 3),
    category: "research",
    relevance: 0.88,
    source: "calendar",
    metadata: {
      type: "deadline",
      priority: "high",
      dueDate: addDays(new Date(), 3)
    }
  }
];

const mockActivities: SearchResult[] = [
  {
    id: "activity-1",
    type: "activity",
    title: "Business Model Canvas Creation",
    description: "Created comprehensive business model for printing business",
    content: "Generated detailed business model canvas including customer segments, value propositions, channels, revenue streams, cost structure, and time & energy budget analysis for Nigerian market.",
    timestamp: subHours(new Date(), 2),
    category: "business",
    relevance: 0.95,
    source: "activity-feed",
    metadata: {
      type: "file_operation",
      action: "write",
      file: "business-model-canvas.md"
    }
  }
];

const typeIcons = {
  document: FileText,
  memory: Memory,
  task: Calendar,
  activity: Activity
};

const typeColors = {
  document: "text-blue-600 bg-blue-50",
  memory: "text-purple-600 bg-purple-50",
  task: "text-green-600 bg-green-50",
  activity: "text-orange-600 bg-orange-50"
};

export function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Combine all mock data
  const allData = [...mockDocuments, ...mockMemories, ...mockTasks, ...mockActivities];

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    const timer = setTimeout(() => {
      const results = allData
        .filter(item => {
          const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.content.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesType = selectedType === "all" || item.type === selectedType;
          
          return matchesQuery && matchesType;
        })
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 20);

      setSearchResults(results);
      
      // Add to search history
      if (searchQuery.length > 2 && !searchHistory.includes(searchQuery)) {
        setSearchHistory(prev => [searchQuery, ...prev.slice(0, 9)]);
      }
      
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedType, searchHistory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const getSearchSuggestions = () => {
    if (searchQuery.length < 2) return [];
    
    return allData
      .filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5)
      .map(item => ({
        id: item.id,
        text: item.title,
        type: item.type
      }));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return format(date, "MMM d, yyyy");
  };

  const resultsByType = searchResults.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold">Global Search</h2>
          <p className="text-muted-foreground">
            Search across all workspace data: documents, memories, tasks, and activities
          </p>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search documents, memories, tasks, activities..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedType === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              All ({allData.length})
            </button>
            <button
              onClick={() => setSelectedType("document")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedType === "document"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Documents ({mockDocuments.length})
            </button>
            <button
              onClick={() => setSelectedType("memory")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedType === "memory"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Memories ({mockMemories.length})
            </button>
            <button
              onClick={() => setSelectedType("task")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedType === "task"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Tasks ({mockTasks.length})
            </button>
            <button
              onClick={() => setSelectedType("activity")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedType === "activity"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Activities ({mockActivities.length})
            </button>
          </div>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Recent searches:</span>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(query)}
                  className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm hover:bg-muted/80"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="space-y-6">
        {isSearching && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Searching...</span>
            </div>
          </div>
        )}

        {!isSearching && searchQuery && searchResults.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No results found for "{searchQuery}"</p>
            <p className="text-sm mt-2">Try different keywords or search terms.</p>
          </div>
        )}

        {!isSearching && searchResults.length > 0 && (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="text-sm text-muted-foreground">
              Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} in {searchQuery}
            </div>

            {/* Grouped Results */}
            {Object.entries(resultsByType).map(([type, results]) => {
              const TypeIcon = typeIcons[type as keyof typeof typeIcons];
              
              return (
                <div key={type} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TypeIcon className="h-4 w-4" />
                    <h3 className="font-semibold capitalize">{type}s</h3>
                    <span className="text-muted-foreground">({results.length})</span>
                  </div>
                  
                  <div className="space-y-3">
                    {results.map((result) => (
                      <div
                        key={result.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("p-2 rounded-lg", typeColors[result.type as keyof typeof typeColors])}>
                            <TypeIcon className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{result.title}</h4>
                                <p className="text-sm text-muted-foreground">{result.description}</p>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatTime(result.timestamp)}
                              </div>
                            </div>
                            
                            <p className="text-sm line-clamp-2">
                              {result.content}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-xs bg-muted px-2 py-1 rounded">
                                  {result.category}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {Math.round(result.relevance * 100)}% match
                                </span>
                              </div>
                              
                              {result.metadata && (
                                <div className="text-xs text-muted-foreground">
                                  {result.source}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}