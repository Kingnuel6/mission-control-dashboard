"use client";

import { useState } from "react";
import { ActivityFeed } from "@/components/ActivityFeed";
import { CalendarView } from "@/components/CalendarView";
import { GlobalSearch } from "@/components/GlobalSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Mission Control</h1>
        <p className="text-muted-foreground">
          Track your AI assistant's activities, schedule tasks, and search your workspace
        </p>
      </div>

      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="search">Global Search</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-4">
          <ActivityFeed />
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <CalendarView />
        </TabsContent>
        
        <TabsContent value="search" className="space-y-4">
          <GlobalSearch />
        </TabsContent>
      </Tabs>
    </div>
  );
}