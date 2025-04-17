"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Flashcard from "../../components/Flashcard";
import FlashcardSets from "../../components/FlashcardSets";
import CreateSetModal from "../../components/CreateSetModal";
import { FlashcardSet, FlashcardData, Project } from "../../types";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.project_id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [decks, setDecks] = useState<FlashcardSet[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project details and decks
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;
        setProject(projectData);

        // Fetch decks with flashcard counts
        const { data: decksData, error: decksError } = await supabase
          .from('decks')
          .select(`
            id,
            name,
            created_at,
            flashcard_count:flashcards(count)
          `)
          .eq('project_id', projectId);

        if (decksError) throw decksError;
        
        const formattedDecks = decksData.map(deck => ({
          id: deck.id,
          title: deck.name,
          cardCount: deck.flashcard_count[0]?.count || 0,
          created_at: deck.created_at
        }));
        
        setDecks(formattedDecks);
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  // Fetch flashcards when a deck is selected
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        if (decks.length === 0) {
          return;
        }

        const { data, error } = await supabase
          .from('flashcards')
          .select(`
            *,
            deck:decks(name)
          `)
          .eq(selectedDeck ? 'deck_id' : 'decks.project_id', selectedDeck || projectId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data) {
          setCards(data.map(card => ({
            id: card.id,
            question: card.question,
            answer: card.answer,
            deckName: card.deck?.name,
          })));
          setCurrentCardIndex(0);
        }
      } catch (err) {
        console.error('Error fetching flashcards:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch flashcards');
      }
    };

    fetchFlashcards();
  }, [decks, selectedDeck, projectId]);

  const handlePreviousCard = () => {
    setCurrentCardIndex(current => Math.max(0, current - 1));
  };

  const handleNextCard = () => {
    setCurrentCardIndex(current => Math.min(cards.length - 1, current + 1));
  };

  const handleCreateSet = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSetSubmit = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('decks')
        .insert([
          {
            project_id: projectId,
            name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select();

      if (error) throw error;

      if (data) {
        const newDeck = {
          id: data[0].id,
          title: data[0].name,
          cardCount: 0,
          created_at: data[0].created_at
        };
        setDecks(prev => [...prev, newDeck]);
        setSelectedDeck(newDeck.id);
      }

      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating deck:', err);
      setError(err instanceof Error ? err.message : 'Failed to create deck');
    }
  };

  const handleRenameDeck = async (deckId: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('decks')
        .update({ name: newName })
        .eq('id', deckId);

      if (error) throw error;

      setDecks(decks.map(deck => 
        deck.id === deckId ? { ...deck, title: newName } : deck
      ));
    } catch (err) {
      console.error('Error renaming deck:', err);
      setError(err instanceof Error ? err.message : 'Failed to rename deck');
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    try {
      const { error } = await supabase
        .from('decks')
        .delete()
        .eq('id', deckId);

      if (error) throw error;

      setDecks(decks.filter(deck => deck.id !== deckId));
      if (selectedDeck === deckId) {
        setSelectedDeck(null);
      }
    } catch (err) {
      console.error('Error deleting deck:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete deck');
    }
  };

  const handleLearnDeck = (deckId: string) => {
    // TODO: Implement learning functionality
    console.log('Learning deck:', deckId);
    // You can add navigation or other learning-related functionality here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded-md">
            Project not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/project"
              className="text-2xl text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Back to projects"
            >
              ←
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              {project.description && (
                <p className="text-gray-600">{project.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href={selectedDeck ? `/learn?deck_id=${selectedDeck}` : `/learn?project_id=${projectId}`}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Start learning
            </Link>
          </div>
        </div>

        <div className="flex space-x-8">
          <FlashcardSets
            sets={decks}
            selectedSet={selectedDeck}
            onSelectSet={(deckId) => {
              setSelectedDeck(currentDeckId => currentDeckId === deckId ? null : deckId);
            }}
            onCreateSet={handleCreateSet}
            onRenameSet={handleRenameDeck}
            onDeleteSet={handleDeleteDeck}
            onLearnSet={handleLearnDeck}
          />
            
          <div className="w-2/3">
            {cards.length > 0 ? (
              <div className="relative">
                <Flashcard
                  question={cards[currentCardIndex].question}
                  answer={cards[currentCardIndex].answer}
                  currentCard={currentCardIndex + 1}
                  totalCards={cards.length}
                />
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <button
                    onClick={handlePreviousCard}
                    disabled={currentCardIndex === 0}
                    className={`p-2 rounded-full bg-white shadow-lg transform -translate-x-1/2 ${
                      currentCardIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    onClick={handleNextCard}
                    disabled={currentCardIndex === cards.length - 1}
                    className={`p-2 rounded-full bg-white shadow-lg transform translate-x-1/2 ${
                      currentCardIndex === cards.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-600">
                  {selectedDeck 
                    ? "No cards in this deck"
                    : decks.length === 0 ? "No flashcards in this project" : "Select a deck to view cards"}
                </p>
              </div>
            )}
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