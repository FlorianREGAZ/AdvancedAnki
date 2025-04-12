"use client";

import { useState } from "react";
import Link from "next/link";
import Flashcard from "../../components/Flashcard";
import FlashcardSets from "../../components/FlashcardSets";
import CreateSetModal from "../../components/CreateSetModal";
import { FlashcardSet, FlashcardData, Difficulty, ReviewTime } from "../../types";

export default function ProjectPage() {
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [currentCard, setCurrentCard] = useState(8);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([
    {
      id: "cell-structure",
      title: "Cell Structure",
      cardCount: 42,
    },
    {
      id: "dna-replication",
      title: "DNA Replication",
      cardCount: 28,
    },
    {
      id: "protein-synthesis",
      title: "Protein Synthesis",
      cardCount: 35,
    },
    {
      id: "cell-division",
      title: "Cell Division",
      cardCount: 31,
    },
    {
      id: "genetics-basics",
      title: "Genetics Basics",
      cardCount: 39,
    },
  ]);
  
  const reviewTimes: ReviewTime[] = [
    { difficulty: 'Again', duration: 1, unit: 'min' },
    { difficulty: 'Hard', duration: 10, unit: 'min' },
    { difficulty: 'Good', duration: 1, unit: 'day' },
    { difficulty: 'Easy', duration: 4, unit: 'days' },
  ];

  const currentFlashcard: FlashcardData = {
    id: "mitochondria",
    question: "Function of Mitochondria",
    answer: "Mitochondria are the powerhouse of the cell. They generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.",
  };

  const handleDifficulty = (difficulty: Difficulty) => {
    const reviewTime = reviewTimes.find(rt => rt.difficulty === difficulty);
    if (reviewTime) {
      const nextReview = new Date();
      if (reviewTime.unit === 'min') {
        nextReview.setMinutes(nextReview.getMinutes() + reviewTime.duration);
      } else {
        nextReview.setDate(nextReview.getDate() + reviewTime.duration);
      }
      console.log(`Card rated as ${difficulty}. Next review at ${nextReview.toLocaleString()}`);
      // TODO: Save the next review time to the database
    }
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit card clicked');
  };

  const handleCreateSet = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSetSubmit = (title: string) => {
    // Create new set object
    const newSet: FlashcardSet = {
      id: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      cardCount: 0,
    };

    // Update state with the new set
    setFlashcardSets(prevSets => [...prevSets, newSet]);
    
    // Automatically select the newly created set
    setSelectedSet(newSet.id);

    // Close the modal
    setIsCreateModalOpen(false);

    // TODO: Make API call to save the new set
    console.log('New set created:', newSet);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/project"
              className="text-2xl text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Back to home"
            >
              ←
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Advanced Biology</h1>
              <p className="text-gray-600">Cell Biology and Genetics</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
              Share
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <span className="text-xl">⭐</span>
            </button>
          </div>
        </div>

        <div className="flex space-x-8">
          <FlashcardSets
            sets={flashcardSets}
            selectedSet={selectedSet}
            onSelectSet={setSelectedSet}
            onCreateSet={handleCreateSet}
          />
            
          <div className="w-2/3">
            <Flashcard
              question={currentFlashcard.question}
              answer={currentFlashcard.answer}
              currentCard={currentCard}
              totalCards={42}
              onDifficulty={handleDifficulty}
              onEdit={handleEdit}
            />
          </div>
        </div>
      </div>

      <CreateSetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSetSubmit}
      />
    </main>
  );
} 