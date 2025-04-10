import { FlashcardSetsProps } from "../types";

export default function FlashcardSets({
  sets,
  selectedSet,
  onSelectSet,
  onCreateSet,
}: FlashcardSetsProps) {
  return (
    <div className="w-1/3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Flashcard Sets</h2>
        <button 
          onClick={onCreateSet}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Create Set
        </button>
      </div>
      <div className="space-y-4">
        {sets.map((set) => (
          <div
            key={set.id}
            className={`p-4 rounded-lg border ${
              selectedSet === set.id
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            } cursor-pointer`}
            onClick={() => onSelectSet(set.id)}
          >
            <h3 className="font-medium">{set.title}</h3>
            <p className="text-sm text-gray-600">{set.cardCount} cards</p>
          </div>
        ))}
      </div>
    </div>
  );
} 