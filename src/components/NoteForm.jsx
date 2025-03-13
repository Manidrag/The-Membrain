import React, { useState } from 'react';
const LINK=import.meta.env.VITE_API_URL;

const NoteForm = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [code, setCode] = useState('');  // Add state for code

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, text, code });  // Include code in the save function
    setTitle('');
    setText('');
    setCode('');  // Clear the code field
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <textarea
        placeholder="Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}  // Add input for code
      />
      <button type="submit">Save Note</button>
    </form>
  );
};

export default NoteForm;
