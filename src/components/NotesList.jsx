import { useState } from 'react';
import { 
  Plus, Type, Heading1, Code, 
  List, Image, Mic, Save,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Recorder from '../components/Recorder';

const CreateNote = () => {
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState([{ id: 1, type: 'text', content: '' }]);
  const [showRecorder, setShowRecorder] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const LINK=import.meta.env.VITE_API_URL;

  const addBlock = (type) => {
    setBlocks(prevBlocks => [...prevBlocks, {
      id: Date.now(),
      type,
      content: '',
      language: type === 'code' ? 'javascript' : undefined
    }]);
  };

  const updateBlock = (id, newContent, language) => {
    setBlocks(blocks.map(block => 
      block.id === id 
        ? { ...block, content: newContent, language: language || block.language } 
        : block
    ));
  };

  const deleteBlock = (id) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const handleTranscriptionComplete = (transcription) => {
    if (activeBlockId) {
      updateBlock(activeBlockId, transcription);
      setShowRecorder(false);
      setActiveBlockId(null);
    }
  };

  const startRecording = (blockId) => {
    setActiveBlockId(blockId);
    setShowRecorder(true);
  };

  const saveNote = async () => {
    try {
      // Combine all block contents into one text
      const combinedText = blocks
        .map(block => {
          if (block.type === 'heading1') {
            return `# ${block.content}\n\n`;
          } else if (block.type === 'code') {
            return `\`\`\`${block.language || 'javascript'}\n${block.content}\n\`\`\`\n\n`;
          }
          return `${block.content}\n\n`;
        })
        .join('');

      const token = localStorage.getItem('token');
      const response = await fetch(LINK +'/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title || 'Untitled Note',
          text: combinedText.trim(),
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save note');
      }

      toast.success('Note saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save note');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="w-full text-3xl font-bold bg-transparent outline-none mb-4"
        />
        <button 
          onClick={saveNote}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => addBlock('text')} className="p-2 hover:bg-gray-800 rounded-lg">
          <Type className="h-5 w-5" />
        </button>
        <button onClick={() => addBlock('heading1')} className="p-2 hover:bg-gray-800 rounded-lg">
          <Heading1 className="h-5 w-5" />
        </button>
        <button onClick={() => addBlock('code')} className="p-2 hover:bg-gray-800 rounded-lg">
          <Code className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6">
        {blocks.map(block => (
          <div key={block.id} className="group relative">
            {block.type === 'text' && (
              <textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                className="w-full bg-transparent resize-none outline-none min-h-[100px] p-4 rounded-lg border border-gray-700 hover:border-gray-500"
                placeholder="Start writing..."
              />
            )}
            
            {block.type === 'heading1' && (
              <input
                type="text"
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                className="w-full text-2xl font-bold bg-transparent outline-none p-4 border-l-4 border-purple-500"
                placeholder="Heading..."
              />
            )}

            {block.type === 'code' && (
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Code Block</span>
                  <select 
                    value={block.language}
                    onChange={(e) => updateBlock(block.id, block.content, e.target.value)}
                    className="bg-gray-800 text-sm px-2 py-1 rounded"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="html">HTML</option>
                  </select>
                </div>
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  className="w-full h-32 bg-gray-900 font-mono text-sm outline-none p-2"
                  placeholder="Enter code here..."
                />
              </div>
            )}

            <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex">
              <button 
                onClick={() => startRecording(block.id)}
                className="p-2 hover:bg-gray-700 rounded-lg"
              >
                <Mic className="h-4 w-4" />
              </button>
              <button 
                onClick={() => deleteBlock(block.id)}
                className="p-2 hover:bg-gray-700 rounded-lg text-red-500"
              >
                <Plus className="h-4 w-4 rotate-45" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showRecorder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-lg relative">
            <button 
              onClick={() => setShowRecorder(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="p-6">
              <Recorder 
                onTranscriptionComplete={handleTranscriptionComplete}
                isAIEnabled={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNote;