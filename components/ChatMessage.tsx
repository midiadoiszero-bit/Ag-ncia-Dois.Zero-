
import React from 'react';
import { Message, Attachment } from '../types';
import { Target, User, FileText } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex w-full mb-8 ${isModel ? 'justify-start' : 'justify-end animate-in slide-in-from-right-4'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 mt-1 ${isModel ? 'mr-4' : 'ml-4'}`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg ${
            isModel 
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20' 
              : 'bg-zinc-800 border border-zinc-700'
          }`}>
            {isModel ? <Target className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-zinc-400" />}
          </div>
        </div>

        {/* Bubble */}
        <div className="flex flex-col">
          <div className={`px-5 py-4 rounded-2xl ${
            isModel 
              ? 'card-glass text-zinc-200 border-zinc-800/80 shadow-xl' 
              : 'bg-cyan-600/10 border border-cyan-500/20 text-cyan-50 shadow-lg'
          }`}>
            {/* Attachments inside bubble for user messages */}
            {!isModel && message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {message.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-300">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="prose prose-invert prose-cyan max-w-none prose-p:leading-relaxed prose-headings:mb-4 prose-headings:mt-6 first:prose-p:mt-0 last:prose-p:mb-0">
              {message.content.split('\n').map((line, i) => (
                <p key={i} className={line.trim() === '' ? 'h-2' : ''}>
                  {line}
                </p>
              ))}
            </div>
          </div>
          <span className={`text-[10px] mt-2 font-bold uppercase tracking-widest text-zinc-600 ${isModel ? 'text-left' : 'text-right'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
