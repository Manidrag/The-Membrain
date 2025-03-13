// src/pages/Insights.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const LINK=import.meta.env.VITE_API_URL;
const Insights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await fetch(LINK +'/insights', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch insights');
        }
        const data = await response.json();
        setInsights(data.insights || []);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchInsights();
    }
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {!loading && insights.length === 0 && (
        <div className="text-center text-gray-500 text-xl">No insights available yet</div>
      )}
      {insights.map((insight) => (
        <div key={insight.noteId} className="bg-white rounded-lg shadow-lg p-8 mb-6 transition transform hover:scale-105">
          <div className="mb-4">
            <Link to={`/notes/${insight.noteId}`} className="block">
              <p className="text-gray-800 text-xl">{insight.text}</p>
            </Link>
          </div>
          {insight.relatedNotes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-600">Related Notes:</h4>
              <div className="space-y-2">
                {insight.relatedNotes.map((related) => (
                  <div 
                    key={related.noteId} 
                    className="p-4 bg-gray-50 rounded hover:bg-gray-100 transition"
                  >
                    <Link 
                      to={`/notes/${related.noteId}`}
                      className="block"
                    >
                      <p className="text-gray-700 text-sm">{related.text}</p>
                      <span className="text-xs text-blue-600">
                        Similarity: {Math.round(related.similarity * 100)}%
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Insights;
