"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle, User } from "lucide-react";

interface ScheduledTask {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: "reminder" | "appointment" | "deadline" | "task";
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "overdue";
  category: string;
  details?: Record<string, any>;
}

const mockTasks: ScheduledTask[] = [
  {
    id: "1",
    title: "Gmail Configuration Reminder",
    description: "Configure Himalaya for Gmail email management",
    date: new Date(),
    type: "reminder",
    priority: "high",
    status: "pending",
    category: "communication"
  },
  {
    id: "2",
    title: "Business Model Canvas Review",
    description: "Review and update printing business strategy",
    date: addDays(new Date(), 2),
    type: "task",
    priority: "medium",
    status: "pending",
    category: "business"
  },
  {
    id: "3",
    title: "Market Research Analysis",
    description: "Analyze Nigeria printing market data",
    date: addDays(new Date(), 3),
    type: "task",
    priority: "high",
    status: "pending",
    category: "research"
  },
  {
    id: "4",
    title: "Competitive Intelligence Report",
    description: "Generate comprehensive competitor analysis",
    date: addDays(new Date(), 5),
    type: "deadline",
    priority: "high",
    status: "pending",
    category: "strategy"
  },
  {
    id: "5",
    title: "Weekly Strategic Meeting",
    description: "Review progress and plan next week's priorities",
    date: addDays(new Date(), 7),
    type: "appointment",
    priority: "medium",
    status: "pending",
    category: "meeting"
  }
];

const priorityColors = {
  low: "text-green-600 bg-green-50",
  medium: "text-yellow-600 bg-yellow-50", 
  high: "text-red-600 bg-red-50"
};

const priorityIcons = {
  low: CheckCircle,
  medium: AlertCircle,
  high: AlertCircle
};

const typeColors = {
  reminder: "text-blue-600 bg-blue-50",
  appointment: "text-purple-600 bg-purple-50",
  deadline: "text-red-600 bg-red-50",
  task: "text-green-600 bg-green-50"
};

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<ScheduledTask[]>(mockTasks);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(task.date, date));
  };

  const goToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const goToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const updateTaskStatus = (taskId: string, status: "completed" | "pending" | "overdue") => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendar View</h2>
          <p className="text-muted-foreground">
            Schedule of all upcoming tasks and appointments
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Today
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-muted rounded-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-medium min-w-[150px] text-center">
              {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
            </span>
            <button
              onClick={goToNextWeek}
              className="p-2 hover:bg-muted rounded-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
        {/* Day Headers */}
        {weekDays.map((day, index) => (
          <div key={index} className="text-center p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium text-muted-foreground">
              {format(day, "EEE")}
            </div>
            <div className={`text-lg font-bold ${
              isSameDay(day, new Date()) ? "text-primary" : ""
            }`}>
              {format(day, "d")}
            </div>
          </div>
        ))}

        {/* Day Content */}
        {weekDays.map((day, index) => {
          const dayTasks = getTasksForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <div
              key={index}
              className={`p-3 border rounded-lg min-h-[200px] ${
                !isCurrentMonth ? "bg-muted/30" : ""
              } ${
                isSameDay(day, new Date()) ? "border-primary" : ""
              }`}
            >
              <div className="space-y-2">
                {dayTasks.map((task) => {
                  const PriorityIcon = priorityIcons[task.priority];
                  const isOverdue = task.status === "pending" && task.date < new Date();
                  
                  return (
                    <div
                      key={task.id}
                      className={`p-2 rounded-lg text-left space-y-1 ${
                        typeColors[task.type]
                      } ${isOverdue ? "border-l-4 border-red-500" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <div className="flex items-center gap-1">
                          <PriorityIcon className={`h-3 w-3 ${priorityColors[task.priority]}`} />
                          <span className={`text-xs ${
                            task.status === "completed" ? "text-green-600" :
                            task.status === "overdue" ? "text-red-600" : "text-gray-600"
                          }`}>
                            {formatTime(task.date)}
                          </span>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-xs opacity-75">{task.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-white/50 px-1 rounded">
                          {task.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                            className="text-xs border rounded px-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="overdue">Overdue</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {dayTasks.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No scheduled tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Tasks Summary */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming High Priority Tasks</h3>
        <div className="space-y-2">
          {tasks
            .filter(task => task.priority === "high" && task.status === "pending")
            .slice(0, 5)
            .map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${typeColors[task.type]}`}>
                    <CalendarIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(task.date, "MMM d, yyyy - HH:mm")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    {task.category}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}