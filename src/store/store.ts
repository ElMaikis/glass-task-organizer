import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { persist } from 'zustand/middleware';

// Types based on the provided database schema
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  listId: string;
  name: string;
  description: string;
  dueDate?: Date;
  order: number;
  priority: Priority;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface List {
  id: string;
  boardId: string;
  name: string;
  order: number;
  tasks: Task[];
  createdAt: Date;
}

export interface Board {
  id: string;
  name: string;
  lists: List[];
  createdAt: Date;
}

interface BoardStore {
  board: Board | null;
  isLoading: boolean;
  
  // Board actions
  createBoard: (name: string) => void;
  updateBoard: (id: string, name: string) => void;
  
  // List actions
  createList: (name: string) => void;
  updateList: (id: string, name: string) => void;
  reorderList: (id: string, newOrder: number) => void;
  deleteList: (id: string) => void;
  
  // Task actions
  createTask: (listId: string, name: string, description?: string, dueDate?: Date, priority?: Priority) => void;
  updateTask: (taskId: string, data: Partial<Task>) => void;
  moveTask: (taskId: string, targetListId: string, newOrder?: number) => void;
  toggleTaskCompletion: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  
  // Filter options
  filterCompleted: boolean;
  setFilterCompleted: (filter: boolean) => void;
  filterPriority: Priority | null;
  setFilterPriority: (priority: Priority | null) => void;
}

// Custom function to handle Date serialization/deserialization
const dateReviver = (key: string, value: any) => {
  // Check if the value is a date string pattern
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)) {
    return new Date(value);
  }
  return value;
};

export const useBoardStore = create<BoardStore>()(
  persist(
    (set) => ({
      board: null,
      isLoading: false,
      filterCompleted: false,
      filterPriority: null,
      
      // Initialize with a default board and sample data for demo purposes
      createBoard: (name: string) => {
        const newBoard: Board = {
          id: uuidv4(),
          name,
          lists: [],
          createdAt: new Date(),
        };
        
        set({ board: newBoard });
        
        // Add some default lists for demo
        const listNames = ['To Do', 'In Progress', 'Done'];
        
        listNames.forEach((listName, index) => {
          const newList: List = {
            id: uuidv4(),
            boardId: newBoard.id,
            name: listName,
            order: index,
            tasks: [],
            createdAt: new Date(),
          };
          
          set((state) => ({
            board: state.board 
              ? { ...state.board, lists: [...state.board.lists, newList] }
              : newBoard
          }));
        });
      },
      
      updateBoard: (id: string, name: string) => {
        set((state) => ({
          board: state.board && state.board.id === id 
            ? { ...state.board, name }
            : state.board
        }));
      },
      
      createList: (name: string) => {
        set((state) => {
          if (!state.board) return state;
          
          const newList: List = {
            id: uuidv4(),
            boardId: state.board.id,
            name,
            order: state.board.lists.length,
            tasks: [],
            createdAt: new Date(),
          };
          
          return {
            board: {
              ...state.board,
              lists: [...state.board.lists, newList]
            }
          };
        });
      },
      
      updateList: (id: string, name: string) => {
        set((state) => {
          if (!state.board) return state;
          
          return {
            board: {
              ...state.board,
              lists: state.board.lists.map(list => 
                list.id === id ? { ...list, name } : list
              )
            }
          };
        });
      },
      
      reorderList: (id: string, newOrder: number) => {
        set((state) => {
          if (!state.board) return state;
          
          const lists = [...state.board.lists];
          const listIndex = lists.findIndex(list => list.id === id);
          
          if (listIndex === -1) return state;
          
          const list = lists[listIndex];
          lists.splice(listIndex, 1);
          lists.splice(newOrder, 0, list);
          
          // Update order property for all lists
          const updatedLists = lists.map((list, index) => ({
            ...list,
            order: index
          }));
          
          return {
            board: {
              ...state.board,
              lists: updatedLists
            }
          };
        });
      },
      
      deleteList: (id: string) => {
        set((state) => {
          if (!state.board) return state;
          
          return {
            board: {
              ...state.board,
              lists: state.board.lists.filter(list => list.id !== id)
                .map((list, index) => ({ ...list, order: index }))
            }
          };
        });
      },
      
      createTask: (listId: string, name: string, description = '', dueDate, priority = 'medium') => {
        set((state) => {
          if (!state.board) return state;
          
          const listIndex = state.board.lists.findIndex(list => list.id === listId);
          if (listIndex === -1) return state;
          
          const list = state.board.lists[listIndex];
          
          const newTask: Task = {
            id: uuidv4(),
            listId,
            name,
            description,
            dueDate,
            order: list.tasks.length,
            priority,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          const updatedLists = [...state.board.lists];
          updatedLists[listIndex] = {
            ...list,
            tasks: [...list.tasks, newTask]
          };
          
          return {
            board: {
              ...state.board,
              lists: updatedLists
            }
          };
        });
      },
      
      updateTask: (taskId: string, data: Partial<Task>) => {
        set((state) => {
          if (!state.board) return state;
          
          const updatedLists = state.board.lists.map(list => ({
            ...list,
            tasks: list.tasks.map(task => 
              task.id === taskId 
                ? { ...task, ...data, updatedAt: new Date() } 
                : task
            )
          }));
          
          return {
            board: {
              ...state.board,
              lists: updatedLists
            }
          };
        });
      },
      
      moveTask: (taskId: string, targetListId: string, newOrder) => {
        set((state) => {
          if (!state.board) return state;
          
          // Find the task
          let targetTask: Task | null = null;
          let sourceListId: string | null = null;
          
          state.board.lists.forEach(list => {
            const task = list.tasks.find(t => t.id === taskId);
            if (task) {
              targetTask = { ...task };
              sourceListId = list.id;
            }
          });
          
          if (!targetTask || !sourceListId) return state;
          
          // Remove from source list
          const updatedLists = state.board.lists.map(list => {
            if (list.id === sourceListId) {
              return {
                ...list,
                tasks: list.tasks.filter(t => t.id !== taskId)
                  .map((task, index) => ({ ...task, order: index }))
              };
            }
            return list;
          });
          
          // Add to target list
          const targetListIndex = updatedLists.findIndex(list => list.id === targetListId);
          if (targetListIndex === -1) return state;
          
          const targetList = updatedLists[targetListIndex];
          const updatedTask = { 
            ...targetTask, 
            listId: targetListId,
            updatedAt: new Date() 
          };
          
          let updatedTasks = [...targetList.tasks];
          
          // Insert at specific order if provided, otherwise add to the end
          if (typeof newOrder === 'number') {
            updatedTasks.splice(newOrder, 0, updatedTask);
            updatedTasks = updatedTasks.map((task, index) => ({ ...task, order: index }));
          } else {
            updatedTask.order = targetList.tasks.length;
            updatedTasks.push(updatedTask);
          }
          
          updatedLists[targetListIndex] = {
            ...targetList,
            tasks: updatedTasks
          };
          
          return {
            board: {
              ...state.board,
              lists: updatedLists
            }
          };
        });
      },
      
      toggleTaskCompletion: (taskId: string) => {
        set((state) => {
          if (!state.board) return state;
          
          const updatedLists = state.board.lists.map(list => ({
            ...list,
            tasks: list.tasks.map(task => 
              task.id === taskId 
                ? { ...task, completed: !task.completed, updatedAt: new Date() } 
                : task
            )
          }));
          
          return {
            board: {
              ...state.board,
              lists: updatedLists
            }
          };
        });
      },
      
      deleteTask: (taskId: string) => {
        set((state) => {
          if (!state.board) return state;
          
          const updatedLists = state.board.lists.map(list => ({
            ...list,
            tasks: list.tasks.filter(task => task.id !== taskId)
              .map((task, index) => ({ ...task, order: index }))
          }));
          
          return {
            board: {
              ...state.board,
              lists: updatedLists
            }
          };
        });
      },
      
      setFilterCompleted: (filter: boolean) => {
        set({ filterCompleted: filter });
      },
      
      setFilterPriority: (priority: Priority | null) => {
        set({ filterPriority: priority });
      }
    }),
    {
      name: 'board-storage',
    }
  )
);
