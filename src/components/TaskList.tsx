import { useState } from "react";
import { useBoardStore, List, Task } from "@/store/store";
import { TaskCard } from "@/components/TaskCard";
import { ListHeader } from "@/components/list/ListHeader";
import { AddTaskForm } from "@/components/list/AddTaskForm";
import { TaskEditDialog } from "@/components/task/TaskEditDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskListProps {
  list: List;
  isExpanded: boolean;
  onCollapse?: () => void; // Add this prop
}

export function TaskList({ list, isExpanded, onCollapse }: TaskListProps) {
  const { 
    updateList, 
    deleteList, 
    createTask,
    updateTask,
    deleteTask,
    filterCompleted,
    filterPriority
  } = useBoardStore();
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const filteredTasks = list.tasks.filter(task => {
    if (filterCompleted && task.completed) {
      return false;
    }
    
    if (filterPriority && task.priority !== filterPriority) {
      return false;
    }
    
    return true;
  });

  const handleCreateTask = (name: string) => {
    createTask(list.id, name);
  };

  if (!isExpanded) {
    return (
      <Card 
        className="h-48 w-full cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-95" 
        onClick={onClick}
      >
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold truncate flex-1">{list.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                const newName = prompt("Digite o novo nome da lista:", list.name);
                if (newName) updateList(list.id, newName);
              }}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Deseja realmente excluir esta lista?")) {
                    deleteList(list.id);
                  }
                }} 
                className="text-destructive"
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardContent className="flex-1 p-2 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="space-y-1">
              {filteredTasks.slice(0, 3).map((task) => (
                <div 
                  key={task.id}
                  className="p-2 truncate text-sm bg-white/5 rounded"
                >
                  {task.name}
                </div>
              ))}
              {filteredTasks.length > 3 && (
                <div className="p-1 text-center text-xs text-muted-foreground">
                  +{filteredTasks.length - 3} more
                </div>
              )}
              {filteredTasks.length === 0 && (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  No tasks
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background animate-in zoom-in-95 slide-in-from-bottom-2 duration-300">
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <ListHeader 
              list={list}
              onUpdateList={updateList}
              onDeleteList={deleteList}
            />
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={onCollapse} // Use the onCollapse prop here
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 mt-4">
            <div className="px-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task}
                    onEdit={setEditingTask}
                  />
                ))}
              </div>
              
              <div className="mt-4">
                <AddTaskForm onAddTask={handleCreateTask} />
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      <TaskEditDialog
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    </>
  );
}
