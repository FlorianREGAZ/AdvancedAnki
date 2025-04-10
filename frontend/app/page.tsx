import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to Advanced Anki</h1>
        <p className="text-xl text-gray-600 mb-8">
          A modern flashcard application for effective learning
        </p>
        <Link 
          href="/project" 
          className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Go to Project
        </Link>
      </div>
    </main>
  );
}
