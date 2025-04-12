import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { FlashcardSet } from "../types";

interface DeckMenuProps {
  deck: FlashcardSet;
  onRename: (newName: string) => void;
  onDelete: () => void;
  onLearn: () => void;
}

export default function DeckMenu({ deck, onRename, onDelete, onLearn }: DeckMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newName, setNewName] = useState(deck.title);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onRename(newName.trim());
      setIsRenameModalOpen(false);
    }
  };

  const handleDelete = () => {
    onDelete();
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="6" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="18" r="1" fill="currentColor" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={() => {
              onLearn();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Learn
          </button>
          <button
            onClick={() => {
              setIsRenameModalOpen(true);
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Rename
          </button>
          <button
            onClick={() => {
              setIsDeleteModalOpen(true);
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}

      <Modal isOpen={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)}>
        <form onSubmit={handleRename}>
          <h2 className="text-xl font-semibold mb-4">Rename Deck</h2>
          <div className="mb-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter new name"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsRenameModalOpen(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Rename
            </button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={deck.title}
        itemType="Deck"
      />
    </div>
  );
} 