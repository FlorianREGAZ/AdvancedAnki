"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Project } from "../../types";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.project_id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                Edit Project
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                Add Cards
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6">
        {/* Progress Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Study Progress</h2>
          <div className="h-2 bg-gray-200 rounded-full flex overflow-hidden mb-3">
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

        {/* Cards Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Cards</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cards..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21L16.65 16.65"/>
                </svg>
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Cards</option>
                <option value="new">New</option>
                <option value="learning">Learning</option>
                <option value="due">Due</option>
              </select>
            </div>
          </div>

          {/* Cards list placeholder - you'll need to implement this based on your data structure */}
          <div className="space-y-4">
            <p className="text-gray-500 text-center py-8">
              No cards yet. Click "Add Cards" to get started.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 