
import { useState } from "react";
import { useBoardStore, List, Task } from "@/store/store";
import { TaskCard } from "@/components/TaskCard";
import { ListHeader } from "@/components/list/ListHeader";
import { AddTaskForm } from "@/components/list/AddTaskForm";
import { TaskEditDialog } from "@/components/task/TaskEditDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

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
    <>
      <AccordionTrigger className="px-4 py-2 glass hover:no-underline">
        <ListHeader 
          list={list}
          onUpdateList={updateList}
          onDeleteList={deleteList}
        />
      </AccordionTrigger>
      
      <AccordionContent>
        <ScrollArea className="max-h-[60vh]">
          <div className="px-4 py-2 space-y-2">
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
      </AccordionContent>

      <TaskEditDialog
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    </>
  );
}
