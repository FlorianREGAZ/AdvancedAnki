export interface FlashcardSet {
  id: string;
  title: string;
  cardCount: number;
}

export interface FlashcardData {
  id: string;
  question: string;
  answer: string;
  review_count?: number;
  deckName?: string;
}

export interface FlashcardProps {
  question: string;
  answer: string;
  currentCard?: number;
  totalCards?: number;
  onDifficulty?: (difficulty: Difficulty) => void;
  onEdit?: () => void;
}

export type Difficulty = 'Again' | 'Hard' | 'Good' | 'Easy';

export interface ReviewTime {
  difficulty: Difficulty;
  duration: number;
  unit: 'min' | 'day' | 'days';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
} 