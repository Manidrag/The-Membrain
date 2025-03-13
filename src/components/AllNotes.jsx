import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Edit, Trash, X } from "lucide-react";
import Navbar from "../components/Navbar";
import NoteDetail from "../components/NoteDetails";
import toast from 'react-hot-toast';
import { marked } from "marked"; 
import SharedBackground from "./SharedBackground";

const LINK=import.meta.env.VITE_API_URL;

const renderMarkdownPreview = (text) => {
  if (!text) return '';
  try {
    return marked(text, { breaks: true, sanitize: true });
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return text;
  }
};

const AllNotes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [filter, setFilter] = useState("personal");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(null); // Add this state for dropdown menu

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(LINK +'/notes/', {
          method: 'GET',
          headers: { 
            
            'Authorization': `Bearer ${token}`,
            
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format");
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }

        setNotes(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        toast.error(`Failed to load notes: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [filter]);

  const filteredNotes = notes.filter(note => 
    note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(LINK+`/notes/${noteToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      // Remove note from state
      setNotes(notes.filter(note => note._id !== noteToDelete._id));
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete note');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  // Add this function to handle menu clicks
  const handleMenuClick = (e, note) => {
    e.stopPropagation();
    setShowMenu(showMenu === note._id ? null : note._id);
  };

  // Modify the NoteCard component
  const NoteCard = ({ note }) => (
    <div 
      key={note._id} 
      onClick={() => handleNoteClick(note)}
      className="bg-gray-800/50 hover:bg-gray-800 transition-all rounded-xl border border-gray-700 group cursor-pointer"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold truncate">
            {note.title || "Untitled Note"}
          </h3>
          <div className="relative">
            <button 
              onClick={(e) => handleMenuClick(e, note)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-700 rounded"
            >
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showMenu === note._id && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(null);
                  }}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 border border-gray-700 z-20">
                  <div className="py-1">
                    <Link
                      to={`/create-note?edit=${note._id}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Note
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNoteToDelete(note);
                        setShowDeleteModal(true);
                        setShowMenu(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Note
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div 
          className="text-sm text-gray-300 line-clamp-3 mb-4"
          dangerouslySetInnerHTML={{__html: renderMarkdownPreview(note.text)}}
        />

        {note.aiTags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {note.aiTags.map(tag => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-700 p-3 flex items-center justify-between">
        {note.collaborators?.length > 0 && (
          <div className="flex -space-x-2">
            {note.collaborators.slice(0,3).map(user => (
              <img 
                key={user.id} 
                src={user.avatar} 
                alt={user.name || 'Collaborator'}
                className="h-6 w-6 rounded-full border-2 border-gray-800" 
              />
            ))}
          </div>
        )}
        <span className="text-xs text-gray-400">
          {new Date(note.updatedAt || note.timestamp).toLocaleDateString()}
        </span>
      </div>
    </div>
  );

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = () => setShowMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
  <div className="relative min-h-screen"><SharedBackground/>
      
    
    <div className="relative z-10">
    <div className="flex h-screen">
    <div className=" text-white font-sans transition-all duration-500">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6 animate-fadeIn">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
          All Your Notes
        </h1>

        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-300">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded border border-gray-700 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="personal">My Notes</option>
              <option value="team">Team Notes</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 placeholder-gray-500"
            />
            <div className="absolute left-3 top-3.5">
              <svg
                className="h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4 bg-red-500/10 rounded-lg">
            {error}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="p-8 bg-gray-800 bg-opacity-75 rounded-lg text-center shadow-md transition-all duration-500 transform hover:scale-105 hover:shadow-lg border border-gray-700">
              <p className="text-gray-400 text-lg">No notes found</p>
              <div className="mt-4 w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full"></div>
              <Link
                to="/create-note"
                className="mt-6 inline-block px-6 py-3 text-cyan-400 hover:text-cyan-300 bg-gray-700 hover:bg-gray-600 rounded-full text-lg transition-all duration-300 border border-gray-600"
              >
                Create a note →
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        )}

        {selectedNote && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn transition-all duration-500">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl m-4 transform transition duration-500 animate-scaleIn border border-gray-700">
              <NoteDetail note={selectedNote} onClose={() => setSelectedNote(null)} />
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md m-4 border border-gray-700 animate-scaleIn">
              <h3 className="text-xl font-semibold mb-4 text-white">Delete Note</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete "{noteToDelete?.title || 'Untitled Note'}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setNoteToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteNote}
                  disabled={isDeleting}
                  className={`px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2 ${
                    isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  </div>
  </div>

  );
};

export default AllNotes;