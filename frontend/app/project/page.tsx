"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { Project } from "../types";
import CreateProjectModal from "../components/CreateProjectModal";
import ProjectMenu from "../components/ProjectMenu";

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'recent' | 'favorites'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


  const fetchDecks = async () => {
    try {
      const { data, error } = await supabase
        .from('decks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch decks');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // TODO: Remove this once we have the real data
        var updatedData = data.map((project) => {
          if (project.name === "Language Learning") {
            return {
              ...project,
              new_cards: 3,
              learning_cards: 5,
              due_cards: 4,
              total_cards: 30,
            };
          }

          return {
              ...project,
              new_cards: 0,
              learning_cards: 0,
              due_cards: 0,
              total_cards: 0,
            };;
        });

        setProjects(updatedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleRenameProject = async (projectId: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ name: newName })
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.map(project => 
        project.id === projectId ? { ...project, name: newName } : project
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.filter(project => project.id !== projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  const handleLearnProject = (projectId: string) => {
    // TODO: Implement learning functionality
    console.log('Learning project:', projectId);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-6 space-y-8">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 3L4 9V21H20V9L11 3L13 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xl font-semibold">FlashMaster</span>
          </div>

          <nav className="space-y-1">
            <Link 
              href="/project" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md bg-gray-200 text-gray-900"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
                <path d="M4 8H20"/>
              </svg>
              <span>Projects</span>
            </Link>
            <Link 
              href="/statistics" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 14L8 10L12 14L20 6"/>
              </svg>
              <span>Statistics</span>
            </Link>
            <Link 
              href="/history" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6V12L16 14"/>
              </svg>
              <span>Study History</span>
            </Link>
            <Link 
              href="/settings" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"/>
                <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"/>
              </svg>
              <span>Settings</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">My Projects</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21L16.65 16.65"/>
                </svg>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5V19M5 12H19"/>
                </svg>
                <span>Create Project</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex space-x-4 mb-6">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('recent')}
              className={`px-4 py-2 rounded-md ${filter === 'recent' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              Recent
            </button>
            <button 
              onClick={() => setFilter('favorites')}
              className={`px-4 py-2 rounded-md ${filter === 'favorites' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              Favorites
            </button>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                console.log("Project:", project),
                <div
                  key={project.id}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <Link href={`/project/${project.id}`} className="block flex-1">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {project.name}
                          </h3>
                        </div>
                        <p className="text-gray-600">{project.new_cards + project.learning_cards + project.due_cards} cards due today</p>
                      </div>
                    </Link>
                    <ProjectMenu
                      project={project}
                      onRename={(newName) => handleRenameProject(project.id, newName)}
                      onDelete={() => handleDeleteProject(project.id)}
                      onLearn={() => handleLearnProject(project.id)}
                    />
                  </div>

                  <div className="mt-4 mb-6">
                    <div className="h-2 bg-gray-200 rounded-full flex overflow-hidden">
                      {project.total_cards > 0 ? (
                        <>
                          {project.new_cards > 0 && (
                            <div 
                              className="h-full bg-blue-500"
                              style={{ 
                                width: `${(project.new_cards / project.total_cards) * 100}%`,
                              }}
                            />
                          )}
                          {project.learning_cards > 0 && (
                            <div 
                              className="h-full bg-orange-500"
                              style={{ 
                                width: `${(project.learning_cards / project.total_cards) * 100}%`,
                              }}
                            />
                          )}
                          {project.due_cards > 0 && (
                            <div 
                              className="h-full bg-green-500"
                              style={{ 
                                width: `${(project.due_cards / project.total_cards) * 100}%`,
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <div className="h-full bg-gray-100 w-full" />
                      )}
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
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
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span>Total ({project.total_cards})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link 
                      href={`/project/${project.id}`}
                      className="flex-1 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-center"
                    >
                      Browse
                    </Link>
                    <Link 
                      href={`/learn?project_id=${project.id}`}
                      className="flex-1 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-center"
                    >
                      Study Now
                    </Link>
                  </div>
                </div>
              ))}

              {/* Create New Project Card */}
              <div 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 cursor-pointer"
              >
                <svg className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5V19M5 12H19"/>
                </svg>
                <p className="text-lg font-medium">Create New Project</p>
                <p className="text-sm">Add a new study space</p>
              </div>
            </div>
          )}

          {/* Study Overview */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Study Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">Today's Progress</h3>
                {/* Add progress visualization here */}
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">Weekly Average</h3>
                {/* Add weekly stats visualization here */}
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">Retention Rate</h3>
                {/* Add retention rate visualization here */}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={async (name, description) => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              
              if (!user) {
                throw new Error('You must be logged in to create a project');
              }

              const { data, error } = await supabase
                .from('projects')
                .insert([
                  {
                    name,
                    description,
                    user_id: user.id,
                    created_at: new Date().toISOString(),
                  }
                ])
                .select();

              if (error) throw error;

              if (data) {
                const newProject = {
                  ...data[0],
                  new_cards: 0,
                  learning_cards: 0,
                  due_cards: 0,
                  total_cards: 0,
                };
                setProjects(prev => [...prev, newProject]);
              }

              setIsCreateModalOpen(false);
            } catch (err) {
              console.error('Error creating project:', err);
              setError(err instanceof Error ? err.message : 'Failed to create project');
            }
          }}
        />
      )}
    </>
  );
}