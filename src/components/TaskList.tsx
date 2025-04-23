
import { useState } from "react";
import { useBoardStore, List, Task } from "@/store/store";
import { TaskCard } from "@/components/TaskCard";
import { ListHeader } from "@/components/list/ListHeader";
import { AddTaskForm } from "@/components/list/AddTaskForm";
import { TaskEditDialog } from "@/components/task/TaskEditDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface TaskListProps {
  list: List;
  isExpanded: boolean;
  onClick?: () => void;
}

export function TaskList({ list, isExpanded, onClick }: TaskListProps) {
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
  
  // Filtrar tarefas baseado nos filtros da store
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

  // Compact card view for lists grid
  if (!isExpanded) {
    return (
      <Card 
        className="h-full w-full cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col" 
        onClick={onClick}
      >
        <div className="p-3 border-b border-white/10">
          <h3 className="font-semibold truncate">{list.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </p>
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

  // Expanded view for detailed task management
  return (
    <>
      <div className="glass rounded-lg overflow-hidden mb-4">
        <div className="p-4">
          <ListHeader 
            list={list}
            onUpdateList={updateList}
            onDeleteList={deleteList}
          />
        </div>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="px-4 py-2 space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task}
                onEdit={setEditingTask}
              />
            ))}
            
            <AddTaskForm onAddTask={handleCreateTask} />
          </div>
        </ScrollArea>
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
