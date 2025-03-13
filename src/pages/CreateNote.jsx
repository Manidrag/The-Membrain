import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, Type, Code, Quote, ListOrdered,
  Save, Mic, X, Sun, Moon, 
  ShareIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Recorder from '../components/Recorder';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../components/css/ThemeProvider';
import SharedBackground from '../components/SharedBackground';
import { useNavigate } from 'react-router-dom';
const LINK=import.meta.env.VITE_API_URL;

// Define block types as constants
const BLOCK_TYPES = {
  HEADING: 'heading1',
  TEXT: 'text',
  CODE: 'code',
  QUOTE: 'quote',
  LIST: 'list'
};

const CreateNote = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState([
    { id: 1, type: BLOCK_TYPES.HEADING, content: '' },
    { id: 2, type: BLOCK_TYPES.TEXT, content: '' }
  ]);
  const [showRecorder, setShowRecorder] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  
  // Add new state for validation
  const [errors, setErrors] = useState({});

  // Add this effect to fetch note data when editing
  useEffect(() => {
    const fetchNote = async () => {
      if (!editId) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(LINK +`/notes/${editId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) throw new Error('Failed to fetch note');

        const note = await response.json();
        setTitle(note.title);
        
        // Convert note content back to blocks
        const textBlocks = note.text.split('\n\n').map((content, index) => ({
          id: Date.now() + index,
          type: content.startsWith('# ') ? BLOCK_TYPES.HEADING : BLOCK_TYPES.TEXT,
          content: content.replace(/^# /, '')
        }));

        setBlocks(textBlocks);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to load note');
      }
    };

    fetchNote();
  }, [editId]);

  const addBlock = (type = BLOCK_TYPES.TEXT) => {
    setBlocks(prevBlocks => [...prevBlocks, {
      id: Date.now(),
      type,
      content: ''
    }]);
  };

  const updateBlock = (id, newContent) => {
    setBlocks(blocks.map(block => 
      block.id === id 
        ? { ...block, content: newContent }
        : block
    ));
  };

  const deleteBlock = (id) => {
    if (blocks.length > 2) {
      setBlocks(blocks.filter(block => block.id !== id));
    } else {
      toast.error('Cannot delete the last remaining blocks');
    }
  };

  const formatBlockContent = (block) => {
    switch (block.type) {
      case BLOCK_TYPES.HEADING:
        return `# ${block.content}\n\n`;
      case BLOCK_TYPES.CODE:
        return `\`\`\`\n${block.content}\n\`\`\`\n\n`;
      case BLOCK_TYPES.QUOTE:
        return `> ${block.content}\n\n`;
      case BLOCK_TYPES.LIST:
        return block.content.split('\n').map(line => `- ${line}`).join('\n') + '\n\n';
      default:
        return `${block.content}\n\n`;
    }
  };

  // Modify the saveNote function to include validation
  const saveNote = async () => {
    // Reset errors
    setErrors({});
    
    // Validate required fields
    if (!title.trim()) {
      setErrors(prev => ({ ...prev, title: 'Title is required' }));
      toast.error('Please add a title');
      return;
    }
  
    // Validate content
    const hasContent = blocks.some(block => block.content.trim());
    if (!hasContent) {
      setErrors(prev => ({ ...prev, content: 'At least one block must have content' }));
      toast.error('Please add some content');
      return;
    }
  
    try {
      setIsSaving(true);
      const headingBlock = blocks.find(block => block.type === BLOCK_TYPES.HEADING);
      const noteTitle = title || headingBlock?.content || 'Untitled Note';
      // Separate code blocks from other content
      const codeBlocks = blocks.filter(block => block.type === BLOCK_TYPES.CODE);
      const textBlocks = blocks.filter(block => block.type !== BLOCK_TYPES.CODE);
      const formattedText = textBlocks
        .filter(block => block.content.trim())
        .map(formatBlockContent)
        .join('')
        .trim();
      const codeContent = codeBlocks
        .filter(block => block.content.trim())
        .map(block => block.content)
        .join('\n\n');
      const token = localStorage.getItem('token');
      
      const url = editId 
        ? LINK +`/notes/${editId}`
        : LINK +'/notes';
      
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: noteTitle,
          text: formattedText,
          code: codeContent,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save note');
      }

      toast.success(`Note ${editId ? 'updated' : 'created'} successfully!`);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/dashboard');
      }, 5000);
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message || `Failed to ${editId ? 'update' : 'create'} note`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTranscriptionComplete = (transcription) => {
    if (activeBlockId) {
      const activeBlock = blocks.find(block => block.id === activeBlockId);
      const newContent = activeBlock.content 
        ? `${activeBlock.content}\n${transcription}`
        : transcription;
      
      updateBlock(activeBlockId, newContent);
      setShowRecorder(false);
      setActiveBlockId(null);
      toast.success('Transcription added to note');
    }
  };

  const startRecording = (blockId) => {
    setActiveBlockId(blockId);
    setShowRecorder(true);
  };

  const renderBlockContent = (block) => {
    switch (block.type) {
      case BLOCK_TYPES.HEADING:
        return (
          <input
            type="text"
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            className={`w-full text-2xl font-bold bg-transparent outline-none p-4 border-l-4 border-purple-500 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
            required
            placeholder="Heading..."
          />
        );
      case BLOCK_TYPES.CODE:
        return (
          <div className="relative">
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              className={`w-full font-mono bg-opacity-50 resize-none outline-none min-h-[100px] p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-gray-100' 
                  : 'bg-gray-100 border-gray-300 text-gray-800'
              }`}
              placeholder="Code here..."
            />
          </div>
        );
      default:
        return (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            className={`w-full bg-transparent resize-none outline-none min-h-[100px] p-4 rounded-lg border ${
              theme === 'dark' 
                ? 'border-gray-700 hover:border-gray-500 text-white' 
                : 'border-gray-300 hover:border-gray-400 text-gray-900'
            }`}
            placeholder="Start writing...kkbr"
          />
        );
    }
  };

  return (
    <div className="relative min-h-screen">
      <SharedBackground/>
      <div className="relative z-10">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <div className="max-w-3xl mx-auto p-6">
              <div className="flex justify-between items-center mb-8">
                <a href='/dashboard'><h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                  MemBrain
                </h1>
                </a>

                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>

              <div className="mb-8 flex flex-col gap-2">
  <div className="flex justify-between items-center">
    <input 
      type="text"
      value={title}
      onChange={(e) => {
        setTitle(e.target.value);
        if (e.target.value.trim()) {
          setErrors(prev => ({ ...prev, title: undefined }));
        }
      }}
      placeholder="Here put the title br"
      className={`w-full text-3xl font-bold bg-transparent outline-none ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      } ${errors.title ? 'border-b-2 border-red-500' : ''}`}
      aria-invalid={errors.title ? 'true' : 'false'}
    />
    <button 
      onClick={saveNote}
      disabled={isSaving}
      className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 text-white ${
        isSaving ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <Save className={`h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
      {isSaving ? 'Saving...' : 'Save'}
    </button>
  </div>
  {errors.title && (
    <span className="text-sm text-red-500">{errors.title}</span>
  )}
</div>

              <div className="flex gap-2 mb-4">
                {Object.entries(BLOCK_TYPES).map(([key, type]) => (
                  <button
                    key={type}
                    onClick={() => addBlock(type)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                    title={`Add ${key.toLowerCase()} block`}
                  >
                    {type === BLOCK_TYPES.TEXT && <Type className="h-5 w-5" />}
                    {type === BLOCK_TYPES.CODE && <Code className="h-5 w-5" />}
                    {type === BLOCK_TYPES.QUOTE && <Quote className="h-5 w-5" />}
                    {type === BLOCK_TYPES.LIST && <ListOrdered className="h-5 w-5" />}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                {blocks.map(block => (
                  <div key={block.id} className="group relative">
                    {renderBlockContent(block)}
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button 
                        onClick={() => startRecording(block.id)}
                        className={`p-2 rounded-lg ${
                          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                        }`}
                        title="Record Audio"
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                      {blocks.length > 2 && (
                        <button 
                          onClick={() => deleteBlock(block.id)}
                          className="p-2 hover:bg-gray-700 rounded-lg text-red-500"
                        >
                          <Plus className="h-4 w-4 rotate-45" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
       <div className="fixed inset-0 flex items-center justify-center z-50">
       <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl transform transition-all animate-fadeIn flex items-center space-x-3">
         <svg 
           className="w-6 h-6 animate-bounce" 
           fill="none" 
           stroke="currentColor" 
           viewBox="0 0 24 24"
         >
           <path 
             strokeLinecap="round" 
             strokeLinejoin="round" 
             strokeWidth={2} 
             d="M5 13l4 4L19 7" 
           />
         </svg>
         <span className="text-lg font-medium">Note Created Successfully!</span>
         <div className="ml-3 h-1 w-24 bg-white/30 rounded">
           <div className="h-full bg-white rounded animate-[shrink_5s_linear]" />
         </div>
       </div>
     </div>
      )}

      {showRecorder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-lg w-full max-w-lg relative shadow-xl`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className={`text-lg font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Voice Recording
              </h3>
              <button 
                className="text-gray-400 hover:text-gray-300 transition-colors"
                onClick={() => setShowRecorder(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <Recorder 
                onTranscriptionComplete={handleTranscriptionComplete}
                isAIEnabled={true}
                theme={theme}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNote;