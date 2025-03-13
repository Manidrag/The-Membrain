import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
const LINK=import.meta.env.VITE_API_URL;


const NoteDetail = ({ note, onClose }) => {
  if (!note) return null;

  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [error, setError] = useState('');
  const [relatedNotes, setRelatedNotes] = useState([]);
  const [shareMessage, setShareMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const token = localStorage.getItem('token');

  const generateSummary = async () => {
    setLoadingSummary(true);
    setError('');
    try {
      const response = await fetch(LINK +'/summarize', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ entryId: note._id })
      });
      if (!response.ok) throw new Error('Summary generation failed');
      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchRelatedNotes = async () => {
    try {
      const response = await fetch(LINK +`/insights/related/${note._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch related notes');
      const data = await response.json();
      setRelatedNotes(data.relatedNotes || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const shareNoteToSlack = async () => {
    setIsSharing(true);
    setShareMessage('');
    try {
      const response = await fetch(LINK +'/share', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ noteId: note._id })
      });
      if (!response.ok) throw new Error('Failed to share note');
      const data = await response.json();
      setShareMessage(data.message);
    } catch (err) {
      console.error(err);
      setShareMessage('Error: ' + err.message);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-black text-white w-full max-w-2xl p-6 rounded shadow-lg relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-white hover:text-gray-300 transition-all duration-300"
        >
          X
        </button>
        <h2 className="text-3xl font-bold mb-4 transition-all duration-500">
          {note.title || "Untitled Note"}
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          {new Date(note.timestamp).toLocaleString()}
        </p>
        <div className="mb-4">
          <p className="text-gray-200">{note.text}</p>
        </div>
        <div className="mb-4 flex flex-wrap gap-3">
          <button 
            onClick={generateSummary} 
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all duration-300"
          >
            {loadingSummary ? 'Generating Summary...' : 'Generate Summary'}
          </button>
          <button 
            onClick={fetchRelatedNotes}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all duration-300"
          >
            Load Related Notes
          </button>
          <button 
            onClick={shareNoteToSlack}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300"
            disabled={isSharing}
          >
            {isSharing ? 'Sharing...' : 'Share to Slack'}
          </button>
        </div>
        {shareMessage && (
          <p className="mt-2 text-sm text-green-400">{shareMessage}</p>
        )}
        {summary && (
          <div className="mt-2 p-3 bg-gray-800 rounded">
            <h3 className="font-semibold text-white">Summary:</h3>
            <p className="text-gray-300">{summary}</p>
          </div>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {relatedNotes.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-white">Related Notes:</h3>
            <ul className="list-disc ml-6">
              {relatedNotes.map(rn => (
                <li key={rn.noteId} className="text-gray-300">{rn.title || "Untitled Note"}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteDetail;