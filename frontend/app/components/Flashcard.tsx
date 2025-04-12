import { FlashcardProps, Difficulty } from "../types";

interface DifficultyOption {
  label: Difficulty;
  nextReview: string;
  className?: string;
}

export default function Flashcard({
  question,
  answer,
  currentCard,
  totalCards,
  onDifficulty,
  onEdit
}: Partial<Omit<FlashcardProps, 'question' | 'answer'>> & Pick<FlashcardProps, 'question' | 'answer'>) {
  const difficultyOptions: DifficultyOption[] = [
    {
      label: 'Again',
      nextReview: '1 min',
      className: 'border-red-300 hover:bg-red-50 text-red-600'
    },
    {
      label: 'Hard',
      nextReview: '10 min',
      className: 'border-orange-300 hover:bg-orange-50 text-orange-600'
    },
    {
      label: 'Good',
      nextReview: '1 day',
      className: 'border-green-300 hover:bg-green-50 text-green-600'
    },
    {
      label: 'Easy',
      nextReview: '4 days',
      className: 'border-blue-300 hover:bg-blue-50 text-blue-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">{question}</h2>
        {currentCard && totalCards && (
          <p className="text-gray-600">Card {currentCard} of {totalCards}</p>
        )}
      </div>

      <div className="bg-white rounded-lg p-8 mb-8 min-h-[200px] flex items-center justify-center border border-gray-100">
        <p className="text-lg text-center">{answer}</p>
      </div>

      {onDifficulty && (
        <div className="flex justify-center space-x-4">
          {difficultyOptions.map((option) => (
            <button 
              key={option.label}
              onClick={() => onDifficulty(option.label)}
              className={`group relative px-6 py-2 border rounded-md ${option.className}`}
            >
              <span>{option.label}</span>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {option.nextReview}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 