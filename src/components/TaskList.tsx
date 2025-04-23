
import { useState } from "react";
import { useBoardStore, List, Task } from "@/store/store";
import { TaskCard } from "@/components/TaskCard";
import { ListHeader } from "@/components/list/ListHeader";
import { AddTaskForm } from "@/components/list/AddTaskForm";
import { TaskEditDialog } from "@/components/task/TaskEditDialog";

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
  
  // Filter tasks based on store filters
  const filteredTasks = list.tasks.filter(task => {
    // Filter by completion status
    if (filterCompleted && task.completed) {
      return false;
    }
    
    // Filter by priority
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
      
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2 scrollbar-thin">
        {filteredTasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task}
            onEdit={setEditingTask}
          />
        ))}
        
        <AddTaskForm onAddTask={handleCreateTask} />
      </div>

      <TaskEditDialog
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    </div>
  );
}
