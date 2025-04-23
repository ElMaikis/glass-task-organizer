
import { Calendar, Check, Clock, Edit, Star, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Task, useBoardStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Map priority to styles
const priorityStyles = {
  low: {
    bg: "bg-priority-low/20",
    border: "border-priority-low/30",
    text: "text-priority-low",
  },
  medium: {
    bg: "bg-priority-medium/20",
    border: "border-priority-medium/30",
    text: "text-priority-medium",
  },
  high: {
    bg: "bg-priority-high/20",
    border: "border-priority-high/30",
    text: "text-priority-high",
  },
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { toggleTaskCompletion, deleteTask } = useBoardStore();
  const priorityStyle = priorityStyles[task.priority];
  
  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskCompletion(task.id);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  return (
    <div 
      onClick={() => onEdit(task)}
      className={cn(
        "card-glass p-3 flex flex-col gap-2 cursor-pointer animate-fade-in",
        task.completed && "opacity-60",
        priorityStyle.border
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className={cn(
            "font-medium line-clamp-2",
            task.completed && "line-through decoration-2 text-muted-foreground"
          )}>
            {task.name}
          </h3>
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {task.description}
            </p>
          )}
        </div>
        <div
          className={cn(
            "w-5 h-5 flex items-center justify-center rounded-full border-2 flex-shrink-0", 
            task.completed ? "bg-primary border-primary" : "border-muted",
          )}
          onClick={handleToggleComplete}
        >
          {task.completed && <Check className="h-3 w-3 text-primary-foreground" />}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center text-xs text-muted-foreground gap-2">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
            </div>
          )}
          
          {!task.dueDate && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn("h-4 w-4 rounded-full flex items-center justify-center", priorityStyle.bg)}>
                  <Star className={cn("h-2.5 w-2.5", priorityStyle.text)} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 opacity-50 hover:opacity-100" 
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
