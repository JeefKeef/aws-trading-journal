"use client";

import { useState } from "react";
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
  Trash2,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { TreeNode } from "@/lib/types/journal";

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

export default function FileTree({ activeNoteId, onSelectNote }: FileTreeProps) {
  const [tree, setTree] = useState<TreeNode[]>(initialTree);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<TreeNode | null>(null);

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

  // Delete node
  const handleDelete = (nodeId: string) => {
    setTree(deleteNode(tree, nodeId));
  };

  const deleteNode = (nodes: TreeNode[], nodeId: string): TreeNode[] => {
    return nodes.filter((node) => {
      if (node.id === nodeId) return false;
      if (node.children) {
        node.children = deleteNode(node.children, nodeId);
      }
      return true;
    });
  };

  // Render tree recursively
  const renderTree = (nodes: TreeNode[], depth = 0) => {
    return nodes
      .filter((node) =>
        searchQuery
          ? node.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      )
      .map((node) => (
        <div key={node.id}>
          <div
            className={cn(
              "group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors",
              activeNoteId === node.id && node.type === "note"
                ? "bg-neutral-100 dark:bg-neutral-800"
                : ""
            )}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => {
              if (node.type === "folder") {
                setTree(toggleFolder(node.id, tree));
              } else {
                onSelectNote(node.id);
              }
            }}
          >
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
                        setSelectedParentId(node.id);
                        setIsNewNoteOpen(true);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      New Note
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedParentId(node.id);
                        setIsNewFolderOpen(true);
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
                    setEditingNode(node);
                    setNewItemName(node.name);
                    setIsRenameOpen(true);
                  }}
                >
                  <Edit2 className="h-3 w-3 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(node.id);
                  }}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Render children */}
          {node.type === "folder" && node.isExpanded && node.children && (
            <div>{renderTree(node.children, depth + 1)}</div>
          )}
        </div>
      ));
  };

  return (
    <div className="flex flex-col h-full border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      {/* Header */}
      <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
          Journal
        </h2>

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

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-2">{renderTree(tree)}</div>

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
    </div>
  );
}
