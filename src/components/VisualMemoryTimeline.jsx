// src/components/VisualMemoryTimeline.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const VisualMemoryTimeline = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const LINK=import.meta.env.VITE_API_URL;

  // Fetch notes from backend
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(LINK +"/notes", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch notes");
        const data = await response.json();

        // Sort notes chronologically (oldest first)
        data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setNotes(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Memory Timeline</h2>
      {loading ? (
        <p>Loading notes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        // The timeline container: a left border and some padding to offset the timeline dots
        <div className="relative border-l-2 border-gray-300 pl-6">
          {notes.map((note) => (
            <div key={note._id} className="mb-8 relative">
              {/* Timeline dot: positioned absolutely to the left */}
              <div className="absolute -left-3 top-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
              
              {/* Display timestamp */}
              <p className="text-sm text-gray-500">
                {new Date(note.timestamp).toLocaleString()}
              </p>
              
              {/* Display note title */}
              <h3 className="text-xl font-bold">
                {note.title || "Untitled Note"}
              </h3>
              
              {/* Display note text (or a snippet) */}
              <p className="mt-2 text-gray-700">{note.text}</p>
              
              {/* Optional: Link to full note details */}
              <Link
                to={`/notes/${note._id}`}
                className="text-cyan-500 hover:underline mt-2 inline-block"
              >
                View Note
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VisualMemoryTimeline;
