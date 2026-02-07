"use client";

import { useState, useEffect } from "react";
import { format, subDays, subHours } from "date-fns";
import { Search, Filter, Clock, Zap, FileText, Database, MessageSquare, Code, Mail, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "tool_call" | "file_operation" | "api_call" | "decision" | "communication";
  action: string;
  description: string;
  timestamp: Date;
  category: string;
  details?: Record<string, any>;
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "tool_call",
    action: "web_search",
    description: "Searched for Kimi K2.5 model specifications",
    timestamp: subHours(new Date(), 1),
    category: "research",
    details: {
      query: "Kimi K2.5 model specifications",
      provider: "NVIDIA NIM"
    }
  },
  {
    id: "2",
    type: "file_operation",
    action: "write",
    description: "Created business model canvas for printing business",
    timestamp: subHours(new Date(), 2),
    category: "business",
    details: {
      file: "business-model-canvas.md",
      size: "15KB"
    }
  },
  {
    id: "3",
    type: "api_call",
    action: "memory_search",
    description: "Searched memory for previous work decisions",
    timestamp: subHours(new Date(), 3),
    category: "memory",
    details: {
      query: "previous work decisions",
      results: 5
    }
  },
  {
    id: "4",
    type: "decision",
    action: "strategy",
    description: "Recommended competitive positioning for printing business",
    timestamp: subHours(new Date(), 4),
    category: "strategy",
    details: {
      market: "Nigeria printing",
      differentiation: "speed + digital-first"
    }
  },
  {
    id: "5",
    type: "communication",
    action: "message",
    description: "Sent reminder for Gmail configuration",
    timestamp: subDays(new Date(), 1),
    category: "communication",
    details: {
      recipient: "user",
      type: "reminder"
    }
  }
];

const typeIcons = {
  tool_call: Code,
  file_operation: FileText,
  api_call: Database,
  decision: Zap,
  communication: MessageSquare
};

const typeColors = {
  tool_call: "text-blue-600 bg-blue-50",
  file_operation: "text-green-600 bg-green-50",
  api_call: "text-purple-600 bg-purple-50",
  decision: "text-orange-600 bg-orange-50",
  communication: "text-pink-600 bg-pink-50"
};

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === "all" || activity.category === filter;
    const matchesSearch = activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = Array.from(new Set(activities.map(a => a.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity Feed</h2>
          <p className="text-muted-foreground">
            Real-time tracking of all AI assistant actions and tasks
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Filter className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium transition-colors",
            filter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          All ({activities.length})
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium transition-colors",
              filter === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {category} ({activities.filter(a => a.category === category).length})
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No activities found matching your search criteria.
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const Icon = typeIcons[activity.type];
            
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={cn("p-2 rounded-lg", typeColors[activity.type])}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{activity.description}</h3>
                    <span className="text-xs text-muted-foreground">
                      {activity.action}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(activity.timestamp, "MMM d, yyyy - HH:mm")}
                    </div>
                    <span className="bg-muted px-2 py-1 rounded text-xs">
                      {activity.category}
                    </span>
                  </div>
                  
                  {activity.details && (
                    <div className="mt-2 p-2 bg-muted rounded text-xs">
                      <pre className="whitespace-pre-wrap break-all">
                        {JSON.stringify(activity.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}