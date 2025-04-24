
import { useEffect, useState } from "react";
import { useBoardStore } from "@/store/store";
import { TaskList } from "@/components/TaskList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";

export function BoardView() {
  const { board, createBoard, createList } = useBoardStore();
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [boardName, setBoardName] = useState("");
  const [expandedListId, setExpandedListId] = useState<string | null>(null);

  useEffect(() => {
    if (!board) {
      createBoard("My Tasks");
    }
  }, [board, createBoard]);

  const handleCreateBoard = () => {
    if (boardName.trim()) {
      createBoard(boardName);
      setBoardName("");
    }
  };

  const handleAddList = () => {
    if (newListName.trim()) {
      createList(newListName);
      setNewListName("");
      setShowAddList(false);
    }
  };

  const handleExpandList = (listId: string) => {
    setExpandedListId(listId);
  };

  const handleCollapseList = () => {
    setExpandedListId(null);
  };

  if (!board) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-md p-6 glass rounded-xl">
          <h2 className="text-2xl font-semibold mb-4">Welcome to FocusFlow</h2>
          <p className="mb-6 text-muted-foreground">
            Get started by creating your first board to organize your tasks.
          </p>
          
          <div className="flex flex-col gap-4">
            <Input
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Enter board name..."
              className="h-10"
            />
            <Button onClick={handleCreateBoard}>Create Board</Button>
          </div>
        </div>
      </div>
    );
  }

  if (expandedListId) {
    const expandedList = board.lists.find(list => list.id === expandedListId);
    if (expandedList) {
      return (
        <div className="h-full flex flex-col">
          <Header />
          
          <div className="fixed inset-0 z-40 flex flex-col animate-in fade-in slide-in-from-bottom duration-300">
            <div className="p-4 flex items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <Button 
                variant="outline" 
                className="mr-2 flex items-center" 
                onClick={handleCollapseList}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lists
              </Button>
              <h2 className="text-xl font-medium">{expandedList.name}</h2>
            </div>
            
            <TaskList 
              list={expandedList} 
              isExpanded={true} 
              onCollapse={handleCollapseList}
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-top duration-300">
      <Header />
      
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-w-[1920px] mx-auto">
          {board.lists.map((list) => (
            <div 
              key={list.id}
            >
              <TaskList 
                list={list} 
                isExpanded={false}
                onClick={() => handleExpandList(list.id)}
              />
            </div>
          ))}
          
          {!showAddList ? (
            <Button
              variant="outline"
              className="h-48 w-full flex flex-col justify-center items-center gap-2 bg-white/5 border border-dashed border-white/20 hover:bg-white/10 transition-colors"
              onClick={() => setShowAddList(true)}
            >
              <Plus className="h-6 w-6" />
              <span>Add List</span>
            </Button>
          ) : (
            <div className="h-48 w-full glass rounded-lg p-3 animate-in fade-in flex flex-col justify-center">
              <Input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter list name..."
                className="mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  size="sm"
                  onClick={handleAddList}
                >
                  Add
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  size="sm"
                  onClick={() => {
                    setShowAddList(false);
                    setNewListName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
