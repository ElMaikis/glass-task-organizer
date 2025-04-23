
import { useEffect, useState } from "react";
import { useBoardStore } from "@/store/store";
import { TaskList } from "@/components/TaskList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function BoardView() {
  const { board, createBoard, createList } = useBoardStore();
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [boardName, setBoardName] = useState("");

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

  return (
    <div className="h-full flex flex-col">
      <Header />
      
      <ScrollArea className="flex-1 px-6 py-4">
        <Accordion type="single" collapsible className="space-y-4 w-full max-w-3xl mx-auto">
          {board.lists.map((list) => (
            <AccordionItem key={list.id} value={list.id} className="border-none">
              <TaskList list={list} />
            </AccordionItem>
          ))}
        </Accordion>

        {!showAddList ? (
          <Button
            variant="outline"
            className="mt-4 w-full max-w-3xl mx-auto flex gap-2 bg-white/5 border border-dashed border-white/20 hover:bg-white/10 transition-colors"
            onClick={() => setShowAddList(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add List</span>
          </Button>
        ) : (
          <div className="mt-4 w-full max-w-3xl mx-auto glass rounded-lg p-3 animate-fade-in">
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
      </ScrollArea>
    </div>
  );
}
