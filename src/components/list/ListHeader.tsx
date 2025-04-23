
import { useState } from "react";
import { List } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ListHeaderProps {
  list: List;
  onUpdateList: (id: string, name: string) => void;
  onDeleteList: (id: string) => void;
}

export function ListHeader({ list, onUpdateList, onDeleteList }: ListHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [listName, setListName] = useState(list.name);

  const handleListNameSave = () => {
    if (listName.trim()) {
      onUpdateList(list.id, listName);
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

  return (
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
              <DropdownMenuItem onClick={() => onDeleteList(list.id)} className="text-destructive">
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
