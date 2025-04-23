
import { useState } from "react";
import { useBoardStore, List, Task } from "@/store/store";
import { TaskCard } from "@/components/TaskCard";
import { ListHeader } from "@/components/list/ListHeader";
import { AddTaskForm } from "@/components/list/AddTaskForm";
import { TaskEditDialog } from "@/components/task/TaskEditDialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

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
    moveTask,
    filterCompleted,
    filterPriority
  } = useBoardStore();
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredTasks.findIndex((task) => task.id === active.id);
      const newIndex = filteredTasks.findIndex((task) => task.id === over.id);
      
      // Atualiza a ordem das tarefas
      moveTask(active.id as string, list.id, newIndex);
    }
  };

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredTasks.map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task}
                onEdit={setEditingTask}
              />
            ))}
          </SortableContext>
        </DndContext>
        
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
