
import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, FileText } from 'lucide-react';
import { Attachment } from '../types';

interface ChatInputProps {
  onSend: (text: string, attachments: Attachment[]) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fix: Explicitly type the iterator variable as File to resolve 'unknown' type errors
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setAttachments(prev => [...prev, {
          name: file.name,
          type: file.type,
          data: base64
        }]);
      };
      // Fix: 'file' is now correctly typed as File (which extends Blob)
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!text.trim() && attachments.length === 0) || isLoading) return;
    onSend(text, attachments);
    setText('');
    setAttachments([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Attachment Preview */}
        {attachments.length > 0 && (
          <div className="absolute bottom-full left-0 mb-2 flex flex-wrap gap-2">
            {attachments.map((file, idx) => (
              <div key={idx} className="flex items-center space-x-2 bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-lg animate-in slide-in-from-bottom-2 duration-200">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-zinc-300 max-w-[120px] truncate">{file.name}</span>
                <button 
                  type="button"
                  onClick={() => removeAttachment(idx)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="card-glass rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500/50 transition-all border-zinc-700/50 shadow-2xl">
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Envie o briefing ou faça uma pergunta estratégica..."
            className="w-full bg-transparent border-none px-6 py-4 pr-24 text-white placeholder:text-zinc-500 focus:outline-none resize-none min-h-[60px] max-h-[200px]"
          />
          
          <div className="absolute right-3 bottom-3 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={isLoading || (!text.trim() && attachments.length === 0)}
              className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl disabled:opacity-50 disabled:bg-zinc-800 transition-all shadow-lg shadow-cyan-900/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          accept=".pdf,.txt,.docx,image/*"
          onChange={handleFileChange}
        />
      </form>
      <p className="text-center text-[10px] text-zinc-600 mt-2 uppercase tracking-widest font-bold">
        Agência Dois.Zero | IA de Alta Performance
      </p>
    </div>
  );
};

export default ChatInput;
