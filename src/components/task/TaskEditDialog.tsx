
import { Task, Priority } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskEditDialogProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: (taskId: string, data: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

export function TaskEditDialog({ task, onClose, onUpdate, onDelete }: TaskEditDialogProps) {
  if (!task) return null;

  const handleUpdateTask = () => {
    if (task) {
      onUpdate(task.id, {
        name: task.name,
        description: task.description,
        priority: task.priority
      });
      onClose();
    }
  };

  return (
    <Dialog open={Boolean(task)} onOpenChange={() => onClose()}>
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
              value={task.name}
              onChange={(e) => onUpdate(task.id, { name: e.target.value })}
              placeholder="Enter task name..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="taskDescription" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="taskDescription"
              value={task.description}
              onChange={(e) => onUpdate(task.id, { description: e.target.value })}
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
              value={task.priority}
              onValueChange={(value) => onUpdate(task.id, { priority: value as Priority })}
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
              onDelete(task.id);
              onClose();
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
  );
}
