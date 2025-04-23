
import { useState } from "react";
import { useBoardStore, List, Task } from "@/store/store";
import { TaskCard } from "@/components/TaskCard";
import { ListHeader } from "@/components/list/ListHeader";
import { AddTaskForm } from "@/components/list/AddTaskForm";
import { TaskEditDialog } from "@/components/task/TaskEditDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskListProps {
  list: List;
}

export function TaskList({ list }: TaskListProps) {
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

  return (
    <div className="w-72 flex flex-col glass rounded-lg h-full animate-scale-in">
      <ListHeader 
        list={list}
        onUpdateList={updateList}
        onDeleteList={deleteList}
      />
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
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

      <TaskEditDialog
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    </div>
  );
}
