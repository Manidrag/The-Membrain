import { useState, useEffect } from 'react';

const OFFLINE_NOTES_KEY = 'offlineNotes';
const LINK=import.meta.env.VITE_API_URL;
export const useOfflineSync = () => {
  const [offlineNotes, setOfflineNotes] = useState([]);

  // Load offline notes from localStorage on mount.
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem(OFFLINE_NOTES_KEY)) || [];
    setOfflineNotes(storedNotes);

    // Listen for online event to trigger sync.
    const handleOnline = () => {
      syncOfflineNotes();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add a new note to offline storage.
  const addOfflineNote = (note) => {
    const updatedNotes = [...offlineNotes, note];
    setOfflineNotes(updatedNotes);
    localStorage.setItem(OFFLINE_NOTES_KEY, JSON.stringify(updatedNotes));
  };

  // Sync all offline notes to the server.
  const syncOfflineNotes = async () => {
    if (!navigator.onLine) return;

    const token = localStorage.getItem('token');
    let unsyncedNotes = [...offlineNotes];

    for (let note of unsyncedNotes) {
      try {
        const response = await fetch(LINK +'/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(note),
        });
        if (response.ok) {
          // Remove this note from the offline notes list.
          unsyncedNotes = unsyncedNotes.filter((n) => n !== note);
        }
      } catch (error) {
        console.error('Sync failed for note:', note, error);
      }
    }
    setOfflineNotes(unsyncedNotes);
    localStorage.setItem(OFFLINE_NOTES_KEY, JSON.stringify(unsyncedNotes));
  };

  return { offlineNotes, addOfflineNote, syncOfflineNotes };
};
