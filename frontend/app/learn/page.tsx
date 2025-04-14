"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabase";
import { Project } from "../types";

export default function LearnPage() {
  const params = useSearchParams();
  const projectId = params.get('project_id');
  console.log("projectId", projectId);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setIsFlipped(!isFlipped);
      }
      
      if (isFlipped) {
        switch (e.key) {
          case '1':
            // Handle Again
            console.log('Again');
            break;
          case '2':
            // Handle Hard
            console.log('Hard');
            break;
          case '3':
            // Handle Good
            console.log('Good');
            break;
          case '4':
            // Handle Easy
            console.log('Easy');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFlipped]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (error) throw error;

        // Add the card statistics (this should come from your actual data)
        const projectWithStats = {
          ...data,
          new_cards: 2,
          learning_cards: 5,
          due_cards: 6,
          total_cards: 30,
          completed_cards: 17,
        };

        setProject(projectWithStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error || 'Project not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/project"
                className="text-gray-600 hover:text-gray-900"
                aria-label="Back to projects"
              >
                ←
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Browse Project
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                Add Cards
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6 flex flex-col h-[calc(100vh-5rem)]">
        {/* Cards Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex-1 flex flex-col">
          {/* Question */}
          <div className="text-2xl font-medium text-center mb-8">
            What is the capital of France?
          </div>

          {/* Answer */}
          <div 
            className="flex-1 flex items-center justify-center text-center cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {!isFlipped ? (
              <p className="text-gray-500">Click or press Enter to reveal answer</p>
            ) : (
              <div className="space-y-4">
                <p className="text-2xl font-medium">Paris</p>
                <p className="text-gray-500">The capital and most populous city of France</p>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between mt-8">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>

            {isFlipped && (
              <div className="flex gap-4">
                <button className="px-6 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                  Again (1)
                </button>
                <button className="px-6 py-2 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200">
                  Hard (2)
                </button>
                <button className="px-6 py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200">
                  Good (3)
                </button>
                <button className="px-6 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200">
                  Easy (4)
                </button>
              </div>
            )}

            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
          <h2 className="text-lg font-semibold mb-4">Study Progress</h2>
          <div className="h-2 bg-gray-200 rounded-full flex overflow-hidden mb-3">
            {project.completed_cards > 0 && (
              <div 
                className="h-full bg-purple-400"
                style={{ width: `${(project.completed_cards / project.total_cards) * 100}%` }}
              />
            )}
            {project.new_cards > 0 && (
              <div 
                className="h-full bg-blue-500"
                style={{ width: `${(project.new_cards / project.total_cards) * 100}%` }}
              />
            )}
            {project.learning_cards > 0 && (
              <div 
                className="h-full bg-orange-500"
                style={{ width: `${(project.learning_cards / project.total_cards) * 100}%` }}
              />
            )}
            {project.due_cards > 0 && (
              <div 
                className="h-full bg-green-500"
                style={{ width: `${(project.due_cards / project.total_cards) * 100}%` }}
              />
            )}
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Completed ({project.completed_cards})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>New ({project.new_cards})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Learn ({project.learning_cards})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Due ({project.due_cards})</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 