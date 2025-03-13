import { useState } from 'react';

const TextInput = () => {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const LINK=import.meta.env.VITE_API_URL;

  const saveNote = async () => {
    if (!text.trim()) return setMessage('Please enter some text');
    try {
   
      const response = await fetch(LINK +'/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to save: ' + response.statusText);
      const data = await response.json();
   
      setMessage('Note saved!');
      setText('');
    } catch (error) {
      console.error('Save error:', error);
      setMessage(`Failed to save note: ${error.message}`);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Add Text Note</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your note here..."
        className="w-full p-2 border rounded"
      />
      <button onClick={saveNote} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">Save</button>
      <p className="mt-2 text-gray-600 italic">{message}</p>
    </div>
  );
};

export default TextInput;