
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddTaskFormProps {
  onAddTask: (name: string) => void;
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      onAddTask(newTaskName);
      setNewTaskName("");
      setShowAddTask(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  if (!showAddTask) {
    return (
      <Button 
        variant="ghost"
        className="flex gap-1.5 bg-white/5 border border-dashed border-white/20 hover:bg-white/10 transition-colors h-full w-full"
        onClick={() => setShowAddTask(true)}
      >
        <Plus className="h-4 w-4" />
        <span>Add Task</span>
      </Button>
    );
  }

  return (
    <div className="bg-white/5 border border-white/20 rounded-lg p-3 h-full flex flex-col justify-center">
      <Input
        value={newTaskName}
        onChange={(e) => setNewTaskName(e.target.value)}
        placeholder="Enter task name..."
        className="h-8 mb-2"
        autoFocus
        onKeyDown={handleKeyDown}
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
  );
}
