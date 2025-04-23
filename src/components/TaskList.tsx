
import { useState } from "react";
import { useBoardStore, List, Task, Priority } from "@/store/store";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus, MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TaskListProps {
  list: List;
}

export function TaskList({ list }: TaskListProps) {
  const { 
    createTask, 
    updateList, 
    deleteList, 
    updateTask,
    filterCompleted,
    filterPriority
  } = useBoardStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [listName, setListName] = useState(list.name);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState({
    name: "",
    description: "",
    priority: "medium" as Priority
  });
  
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
  
  const handleListNameSave = () => {
    if (listName.trim()) {
      updateList(list.id, listName);
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleListNameSave();
    }
    if (e.key === 'Escape') {
      setListName(list.name);
      setIsEditing(false);
    }
  };
  
  const handleAddTask = () => {
    if (newTaskName.trim()) {
      createTask(list.id, newTaskName);
      setNewTaskName("");
      setShowAddTask(false);
    }
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      name: task.name,
      description: task.description,
      priority: task.priority
    });
  };
  
  const handleUpdateTask = () => {
    if (editingTask && taskForm.name.trim()) {
      updateTask(editingTask.id, {
        name: taskForm.name,
        description: taskForm.description,
        priority: taskForm.priority
      });
      setEditingTask(null);
    }
  };
  
  const handleAddTaskKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="w-72 flex flex-col glass rounded-lg h-full animate-scale-in">
      <div className="p-3 border-b border-white/10">
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              onBlur={handleListNameSave}
              onKeyDown={handleKeyDown}
              className="h-7"
              autoFocus
            />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h3 className="font-semibold truncate">{list.name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100">
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="h-3.5 w-3.5 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => deleteList(list.id)} className="text-destructive">
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete List
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2 scrollbar-thin">
        {filteredTasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task}
            onEdit={handleEditTask}
          />
        ))}
        
        {!showAddTask ? (
          <Button 
            variant="ghost"
            className="flex gap-1.5 bg-white/5 border border-dashed border-white/20 hover:bg-white/10 transition-colors"
            onClick={() => setShowAddTask(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </Button>
        ) : (
          <div className="card-glass p-2 flex flex-col gap-2">
            <Input
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Enter task name..."
              className="h-8"
              autoFocus
              onKeyDown={handleAddTaskKeyDown}
            />
            <div className="flex gap-2">
              <Button 
                size="sm"
                className="flex-1"
                onClick={handleAddTask}
              >
                Add
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowAddTask(false);
                  setNewTaskName("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Task Edit Dialog */}
      <Dialog open={editingTask !== null} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the details of your task.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="taskName" className="text-sm font-medium">
                Task Name
              </label>
              <Input
                id="taskName"
                value={taskForm.name}
                onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
                placeholder="Enter task name..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="taskDescription" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="taskDescription"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="Add details about this task..."
                className="resize-none"
                rows={3}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="taskPriority" className="text-sm font-medium">
                Priority
              </label>
              <Select
                value={taskForm.priority}
                onValueChange={(value) => setTaskForm({ ...taskForm, priority: value as Priority })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-priority-low" />
                      <span>Low</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-priority-medium" />
                      <span>Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-priority-high" />
                      <span>High</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (editingTask) {
                  deleteList(editingTask.id);
                  setEditingTask(null);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingTask(null)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleUpdateTask}>
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
