export interface FlashcardSet {
  id: string;
  title: string;
  cardCount: number;
  created_at: string;
}

export interface FlashcardData {
  id: string;
  question: string;
  answer: string;
}

export type Difficulty = 'Again' | 'Hard' | 'Good' | 'Easy';

export interface ReviewTime {
  difficulty: Difficulty;
  duration: number;
  unit: 'min' | 'day' | 'days';
}

// Modal Props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Component Props
export interface FlashcardProps {
  question: string;
  answer: string;
  currentCard: number;
  totalCards: number;
  tags?: string[];
  onDifficulty: (difficulty: Difficulty) => void;
  onEdit: () => void;
}

export interface FlashcardSetsProps {
  sets: FlashcardSet[];
  selectedSet: string | null;
  onSelectSet: (setId: string) => void;
  onCreateSet: () => void;
}

export interface CreateSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
} 

export interface Project {
  id: string;
  name: string;
  description: string;
  total_cards: number;
  new_cards: number;
  learning_cards: number;
  due_cards: number;
  created_at: string;
}

export interface ProjectMenuProps {
  project: Project;
  onRename: (newName: string) => void;
  onDelete: () => void;
  onLearn: () => void;
}