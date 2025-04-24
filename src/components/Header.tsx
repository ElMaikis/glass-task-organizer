import { Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBoardStore } from "@/store/store";

export function Header() {
  const { 
    board,
    createList,
    filterCompleted,
    setFilterCompleted,
    filterPriority,
    setFilterPriority
  } = useBoardStore();

  const handleAddList = () => {
    createList("New List");
  };

  return (
    <header className="h-16 shrink-0 glass border-b border-b-white/10 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          {board?.name || "FocusFlow"}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex gap-2 items-center">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setFilterCompleted(!filterCompleted)}
              className="flex items-center justify-between"
            >
              {filterCompleted ? "Show all tasks" : "Hide completed tasks"}
              {filterCompleted && <span className="h-2 w-2 bg-primary rounded-full"></span>}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>By Priority</DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => setFilterPriority(null)}
              className="flex items-center justify-between"
            >
              All
              {filterPriority === null && <span className="h-2 w-2 bg-primary rounded-full"></span>}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setFilterPriority('high')}
              className="flex items-center justify-between"
            >
              High
              {filterPriority === 'high' && <span className="h-2 w-2 bg-priority-high rounded-full"></span>}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setFilterPriority('medium')}
              className="flex items-center justify-between"
            >
              Medium
              {filterPriority === 'medium' && <span className="h-2 w-2 bg-priority-medium rounded-full"></span>}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setFilterPriority('low')}
              className="flex items-center justify-between"
            >
              Low
              {filterPriority === 'low' && <span className="h-2 w-2 bg-priority-low rounded-full"></span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={handleAddList} size="sm" className="flex gap-1 items-center">
          <Plus className="h-4 w-4" />
          <span>Add List</span>
        </Button>
      </div>
    </header>
  );
}
