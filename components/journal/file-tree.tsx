"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Folder,
  FolderOpen,
  FileText,
  Plus,
  MoreHorizontal,
  Search,
  ChevronRight,
  ChevronDown,
  Edit2,
  GripVertical,
  Trash2,
  HardDrive,
} from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { TreeNode } from "@/lib/types/journal";
import { toast } from "sonner";

type FileTreeProps = {
  activeNoteId: string | null;
  onSelectNote: (noteId: string) => void;
};

// Mock initial tree structure
const initialTree: TreeNode[] = [
  {
    id: "folder-1",
    name: "Trades",
    type: "folder",
    isExpanded: true,
    children: [
      {
        id: "folder-2",
        name: "2025",
        type: "folder",
        isExpanded: true,
        children: [
          {
            id: "folder-3",
            name: "November",
            type: "folder",
            isExpanded: true,
            children: [
              { id: "note-1", name: "AAPL Breakout Setup", type: "note" },
              { id: "note-2", name: "TSLA Reversal Trade", type: "note" },
            ],
          },
          {
            id: "folder-4",
            name: "October",
            type: "folder",
            isExpanded: false,
            children: [
              { id: "note-3", name: "NVDA AI Rally", type: "note" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "folder-5",
    name: "Setups",
    type: "folder",
    isExpanded: true,
    children: [
      { id: "note-4", name: "Breakout Playbook", type: "note" },
      { id: "note-5", name: "Reversal Patterns", type: "note" },
    ],
  },
  {
    id: "folder-6",
    name: "Research",
    type: "folder",
    isExpanded: false,
    children: [
      { id: "note-6", name: "Sector Analysis Q4", type: "note" },
    ],
  },
];

// Draggable tree item component
type SortableTreeItemProps = {
  node: TreeNode;
  depth: number;
  activeNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onToggleFolder: () => void;
  onAddNote: () => void;
  onAddFolder: () => void;
  onRename: () => void;
  onDelete: () => void;
  children?: React.ReactNode;
};

function SortableTreeItem({
  node,
  depth,
  activeNoteId,
  onSelectNote,
  onToggleFolder,
  onAddNote,
  onAddFolder,
  onRename,
  onDelete,
  children,
}: SortableTreeItemProps) {
  // Setup draggable for all items
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: node.id,
    data: { node },
  });

  // Setup droppable only for folders
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: node.id,
    disabled: node.type !== "folder",
    data: { node },
  });

  // Combine refs
  const setNodeRef = (element: HTMLElement | null) => {
    setDragRef(element);
    if (node.type === "folder") {
      setDropRef(element);
    }
  };

  const canDrop = isOver && node.type === "folder";

  return (
    <div ref={setNodeRef} className="relative" style={{ opacity: isDragging ? 0.3 : 1 }}>
      {/* Drop indicator for folders */}
      {canDrop && (
        <>
          <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-md pointer-events-none z-10" />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-20 shadow-lg">
            Drop into &ldquo;{node.name}&rdquo;
          </div>
        </>
      )}
      
      <div
        className={cn(
          "group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-all relative",
          activeNoteId === node.id && node.type === "note"
            ? "bg-neutral-100 dark:bg-neutral-800"
            : "",
          canDrop
            ? "bg-blue-50 dark:bg-blue-950/30"
            : ""
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (node.type === "folder") {
            onToggleFolder();
          } else {
            onSelectNote(node.id);
          }
        }}
      >
        {/* Drag handle - always visible and larger hit area */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded p-1 -ml-1 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4 text-neutral-400" />
        </div>

        {/* Icon */}
        {node.type === "folder" ? (
          <div className="flex items-center gap-1">
            {node.isExpanded ? (
              <ChevronDown className="h-3 w-3 text-neutral-500" />
            ) : (
              <ChevronRight className="h-3 w-3 text-neutral-500" />
            )}
            {node.isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 text-blue-500" />
            )}
          </div>
        ) : (
          <FileText className="h-4 w-4 text-neutral-500 ml-4" />
        )}

        {/* Name */}
        <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300 truncate">
          {node.name}
        </span>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {node.type === "folder" && (
              <>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddNote();
                  }}
                >
                  <Plus className="h-3 w-3 mr-2" />
                  New Note
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddFolder();
                  }}
                >
                  <Plus className="h-3 w-3 mr-2" />
                  New Folder
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onRename();
              }}
            >
              <Edit2 className="h-3 w-3 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Render children */}
      {children}
    </div>
  );
}

export default function FileTree({ activeNoteId, onSelectNote }: FileTreeProps) {
  const [tree, setTree] = useState<TreeNode[]>(initialTree);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<TreeNode | null>(null);
  const [deletingNode, setDeletingNode] = useState<TreeNode | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration mismatch by only rendering DnD after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Setup sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px movement required before drag starts (easier activation)
      },
    })
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const draggedNode = findNode(tree, active.id as string);
    
    if (!draggedNode) return;

    // Check if dropping to root (when over.id is 'root-droppable')
    if (over.id === 'root-droppable') {
      // Move to root level - remove from current location and add to root
      let newTree = removeNode(tree, draggedNode.id);
      // Create a copy with parentId explicitly set to undefined to make it a root-level item
      const updatedNode = { ...draggedNode, parentId: undefined };
      // Add to end of root array
      newTree = [...newTree, updatedNode];
      setTree(newTree);
      return;
    }

    const targetNode = findNode(tree, over.id as string);

    if (!targetNode) return;

    // Prevent dropping folder into itself or its descendants
    if (draggedNode.type === "folder" && isDescendant(tree, draggedNode.id, targetNode.id)) {
      return;
    }

    // Only allow dropping into folders
    if (targetNode.type === "folder") {
      let newTree = removeNode(tree, draggedNode.id);
      const updatedNode = { ...draggedNode, parentId: targetNode.id };
      newTree = addNodeToParent(newTree, targetNode.id, updatedNode);
      setTree(newTree);
    }
  };

  // Toggle folder expansion
  const toggleFolder = (nodeId: string, nodes: TreeNode[]): TreeNode[] => {
    return nodes.map((node) => {
      if (node.id === nodeId && node.type === "folder") {
        return { ...node, isExpanded: !node.isExpanded };
      }
      if (node.children) {
        return { ...node, children: toggleFolder(nodeId, node.children) };
      }
      return node;
    });
  };

  // Helper to add node to parent
  const addNodeToParent = (
    nodes: TreeNode[],
    parentId: string,
    newNode: TreeNode
  ): TreeNode[] => {
    return nodes.map((node) => {
      if (node.id === parentId && node.type === "folder") {
        return {
          ...node,
          children: [...(node.children || []), newNode],
          isExpanded: true,
        };
      }
      if (node.children) {
        return { ...node, children: addNodeToParent(node.children, parentId, newNode) };
      }
      return node;
    });
  };

  // Add new folder
  const handleAddFolder = () => {
    if (!newItemName.trim()) return;

    const timestamp = Date.now();
    const newFolder: TreeNode = {
      id: `folder-${timestamp}`,
      name: newItemName,
      type: "folder",
      isExpanded: true,
      children: [],
      parentId: selectedParentId || undefined,
    };

    if (selectedParentId) {
      setTree(addNodeToParent(tree, selectedParentId, newFolder));
    } else {
      setTree([...tree, newFolder]);
    }

    setNewItemName("");
    setIsNewFolderOpen(false);
    setSelectedParentId(null);
  };

  // Add new note
  const handleAddNote = () => {
    if (!newItemName.trim()) return;

    const timestamp = Date.now();
    const newNote: TreeNode = {
      id: `note-${timestamp}`,
      name: newItemName,
      type: "note",
      parentId: selectedParentId || undefined,
    };

    if (selectedParentId) {
      setTree(addNodeToParent(tree, selectedParentId, newNote));
    } else {
      setTree([...tree, newNote]);
    }

    setNewItemName("");
    setIsNewNoteOpen(false);
    setSelectedParentId(null);
    
    // Auto-select the new note
    onSelectNote(newNote.id);
  };

  // Rename node
  const handleRename = () => {
    if (!newItemName.trim() || !editingNode) return;

    setTree(renameNode(tree, editingNode.id, newItemName));
    setNewItemName("");
    setIsRenameOpen(false);
    setEditingNode(null);
  };

  const renameNode = (nodes: TreeNode[], nodeId: string, newName: string): TreeNode[] => {
    return nodes.map((node) => {
      if (node.id === nodeId) {
        return { ...node, name: newName };
      }
      if (node.children) {
        return { ...node, children: renameNode(node.children, nodeId, newName) };
      }
      return node;
    });
  };

  // Delete node handler
  const handleDelete = async () => {
    if (!deletingNode) return;

    setIsDeleting(true);

    // Simulate async operation (you can replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 500));

    setTree(removeNode(tree, deletingNode.id));
    
    // Show toast notification
    toast.success(`${deletingNode.type === "folder" ? "Folder" : "Note"} deleted`, {
      description: `"${deletingNode.name}" has been deleted successfully.`,
    });

    // If the deleted item was the active note, clear selection
    if (deletingNode.type === "note" && activeNoteId === deletingNode.id) {
      onSelectNote("");
    }

    setIsDeleting(false);
    setIsDeleteOpen(false);
    setDeletingNode(null);
  };

  // Find node by ID
  const findNode = (nodes: TreeNode[], nodeId: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === nodeId) return node;
      if (node.children) {
        const found = findNode(node.children, nodeId);
        if (found) return found;
      }
    }
    return null;
  };

  // Remove node from tree
  const removeNode = (nodes: TreeNode[], nodeId: string): TreeNode[] => {
    return nodes
      .filter((node) => node.id !== nodeId)
      .map((node) => {
        if (node.children) {
          return { ...node, children: removeNode(node.children, nodeId) };
        }
        return node;
      });
  };

  // Check if node is descendant of another
  const isDescendant = (nodes: TreeNode[], parentId: string, childId: string): boolean => {
    const parent = findNode(nodes, parentId);
    if (!parent || parent.type !== "folder" || !parent.children) return false;
    
    for (const child of parent.children) {
      if (child.id === childId) return true;
      if (child.type === "folder" && child.children) {
        if (isDescendant([child], child.id, childId)) return true;
      }
    }
    return false;
  };

  // Filter tree based on search, keeping parent folders if children match
  const filterTree = (nodes: TreeNode[], query: string): TreeNode[] => {
    if (!query) return nodes;
    
    return nodes
      .map(node => {
        // If it's a folder, check if it or any children match
        if (node.type === "folder" && node.children) {
          const filteredChildren = filterTree(node.children, query);
          const nodeNameMatches = node.name.toLowerCase().includes(query.toLowerCase());
          
          // Keep folder if it matches or has matching children
          if (nodeNameMatches || filteredChildren.length > 0) {
            return {
              ...node,
              children: filteredChildren,
              isExpanded: true, // Auto-expand folders when searching
            };
          }
          return null;
        }
        
        // For notes, just check if the name matches
        if (node.name.toLowerCase().includes(query.toLowerCase())) {
          return node;
        }
        
        return null;
      })
      .filter((node): node is TreeNode => node !== null);
  };

  // Render tree recursively
  const renderTree = (nodes: TreeNode[], depth = 0, skipFilter = false) => {
    // Only apply filter at the top level, not in recursive calls
    const nodesToRender = !skipFilter && searchQuery ? filterTree(nodes, searchQuery) : nodes;
    
    return nodesToRender.map((node) => (
      <SortableTreeItem
        key={node.id}
        node={node}
        depth={depth}
        activeNoteId={activeNoteId}
        onSelectNote={onSelectNote}
        onToggleFolder={() => setTree(toggleFolder(node.id, tree))}
        onAddNote={() => {
          setSelectedParentId(node.id);
          setIsNewNoteOpen(true);
        }}
        onAddFolder={() => {
          setSelectedParentId(node.id);
          setIsNewFolderOpen(true);
        }}
        onRename={() => {
          setEditingNode(node);
          setNewItemName(node.name);
          setIsRenameOpen(true);
        }}
        onDelete={() => {
          setDeletingNode(node);
          setIsDeleteOpen(true);
        }}
      >
        {node.type === "folder" && node.isExpanded && node.children && (
          <div>{renderTree(node.children, depth + 1, true)}</div>
        )}
      </SortableTreeItem>
    ));
  };  // Root folder component (non-draggable)
  function RootFolder({ children }: { children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({
      id: 'root-droppable',
    });

    const [isExpanded, setIsExpanded] = useState(true);

    return (
      <div>
        <div
          ref={setNodeRef}
          className={cn(
            "group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-all",
            isOver ? "bg-blue-100 dark:bg-blue-950/50 ring-2 ring-blue-500 ring-inset shadow-lg" : ""
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* No drag handle for root */}
          <div className="w-4 h-4" /> {/* Spacer to align with other items */}

          {/* Icon */}
          <div className="flex items-center gap-1">
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-neutral-500" />
            ) : (
              <ChevronRight className="h-3 w-3 text-neutral-500" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-amber-500" />
            ) : (
              <Folder className="h-4 w-4 text-amber-500" />
            )}
          </div>

          {/* Name */}
          <span className="flex-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Root
          </span>

          {isOver && (
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
              Drop to move to root
            </span>
          )}

          {/* Actions - only show New Note and New Folder */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedParentId(null);
                  setIsNewNoteOpen(true);
                }}
              >
                <Plus className="h-3 w-3 mr-2" />
                New Note
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedParentId(null);
                  setIsNewFolderOpen(true);
                }}
              >
                <Plus className="h-3 w-3 mr-2" />
                New Folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Children */}
        {isExpanded && <div className="ml-4">{children}</div>}
      </div>
    );
  }

  // Simple wrapper for the tree (no longer a droppable)
  function TreeWrapper({ children }: { children: React.ReactNode }) {
    return <div className="p-2">{children}</div>;
  }

  // Calculate storage usage (mock calculation based on number of notes and folders)
  const calculateStorage = useMemo(() => {
    let noteCount = 0;
    let folderCount = 0;

    const countNodes = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.type === "note") {
          noteCount++;
        } else if (node.type === "folder") {
          folderCount++;
          if (node.children) {
            countNodes(node.children);
          }
        }
      });
    };

    countNodes(tree);

    // Mock calculation: ~50KB per note, ~5KB per folder
    const usedMB = ((noteCount * 50 + folderCount * 5) / 1024).toFixed(2);
    const totalMB = 1024; // 1GB total storage
    const percentage = Math.min((parseFloat(usedMB) / totalMB) * 100, 100);

    return {
      used: usedMB,
      total: totalMB,
      percentage: percentage.toFixed(1),
      noteCount,
      folderCount,
    };
  }, [tree]);

  // Storage meter component
  function StorageMeter() {
    const { used, total, percentage, noteCount, folderCount } = calculateStorage;
    const percentNum = parseFloat(percentage);
    
    // Determine color based on usage
    const getColor = () => {
      if (percentNum >= 90) return "bg-red-500";
      if (percentNum >= 75) return "bg-amber-500";
      return "bg-blue-500";
    };

    const getTextColor = () => {
      if (percentNum >= 90) return "text-red-600 dark:text-red-400";
      if (percentNum >= 75) return "text-amber-600 dark:text-amber-400";
      return "text-blue-600 dark:text-blue-400";
    };

    return (
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <HardDrive className="h-3.5 w-3.5 text-neutral-500" />
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            Storage
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2 mb-2 overflow-hidden">
          <div
            className={`h-full ${getColor()} transition-all duration-300 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Storage details */}
        <div className="flex items-center justify-between text-xs">
          <span className={`font-medium ${getTextColor()}`}>
            {used} MB of {total} MB
          </span>
          <span className="text-neutral-500">
            {percentage}%
          </span>
        </div>
        
        {/* Item count */}
        <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {noteCount} {noteCount === 1 ? "note" : "notes"}
          </span>
          <span className="flex items-center gap-1">
            <Folder className="h-3 w-3" />
            {folderCount} {folderCount === 1 ? "folder" : "folders"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      {/* Header */}
      <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-2 top-2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>

        {/* New Items Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={() => {
              setSelectedParentId(null);
              setIsNewFolderOpen(true);
            }}
          >
            <Plus className="h-3 w-3 mr-1" />
            Folder
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={() => {
              setSelectedParentId(null);
              setIsNewNoteOpen(true);
            }}
          >
            <Plus className="h-3 w-3 mr-1" />
            Note
          </Button>
        </div>
      </div>

      {/* Tree with Drag and Drop - Scrollable area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {!isMounted ? (
          // Render without DnD on server to avoid hydration mismatch
          <TreeWrapper>
            <RootFolder>
              {renderTree(tree)}
            </RootFolder>
          </TreeWrapper>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <TreeWrapper>
              <RootFolder>
                {renderTree(tree)}
              </RootFolder>
            </TreeWrapper>
            <DragOverlay dropAnimation={null}>
              {activeId ? (
                <div className="bg-white dark:bg-neutral-900 border-2 border-blue-500 rounded-md px-3 py-2 shadow-2xl flex items-center gap-2 min-w-[200px]">
                  {findNode(tree, activeId)?.type === "folder" ? (
                    <Folder className="h-4 w-4 text-blue-500 shrink-0" />
                  ) : (
                    <FileText className="h-4 w-4 text-neutral-500 shrink-0" />
                  )}
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
                    {findNode(tree, activeId)?.name || ""}
                  </span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Storage Meter */}
      <StorageMeter />

      {/* New Folder Dialog */}
      <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
            <DialogDescription>Create a new folder to organize your notes.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                placeholder="e.g., 2025 Trades"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddFolder()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFolderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Note Dialog */}
      <Dialog open={isNewNoteOpen} onOpenChange={setIsNewNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Note</DialogTitle>
            <DialogDescription>Create a new note in your journal.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="note-name">Note Name</Label>
              <Input
                id="note-name"
                placeholder="e.g., AAPL Trade Analysis"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewNoteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote}>Create Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {editingNode?.type === "folder" ? "Folder" : "Note"}</DialogTitle>
            <DialogDescription>
              Enter a new name for this {editingNode?.type}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rename">Name</Label>
              <Input
                id="rename"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={isDeleteOpen} 
        onOpenChange={(open) => {
          // Prevent closing while deleting
          if (!isDeleting) {
            setIsDeleteOpen(open);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deletingNode?.type === "folder" ? "Folder" : "Note"}?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deletingNode?.name}&rdquo;?
              {deletingNode?.type === "folder" && deletingNode.children && deletingNode.children.length > 0 && (
                <span className="block mt-2 text-red-600 dark:text-red-400 font-medium">
                  Warning: This folder contains {deletingNode.children.length} item(s) that will also be deleted.
                </span>
              )}
              {deletingNode?.type === "folder" && (!deletingNode.children || deletingNode.children.length === 0) && (
                <span className="block mt-2">
                  This action cannot be undone.
                </span>
              )}
              {deletingNode?.type === "note" && (
                <span className="block mt-2">
                  This action cannot be undone.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spinner className="mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
