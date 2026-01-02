
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Zap,
  Loader2,
  Trash2
} from 'lucide-react';
import { Attachment, Message, ChatState } from './types';
import { sendChatMessage } from './services/gemini';
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';

const App: React.FC = () => {
  const [chat, setChat] = useState<ChatState>({
    messages: [
      {
        role: 'model',
        content: 'Olá! Sou o Estrategista Dois.Zero. Envie seu briefing como documento ou texto para começarmos a arquitetar sua vantagem competitiva.',
        timestamp: Date.now(),
      }
    ],
    isLoading: false,
    error: null,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages, chat.isLoading]);

  const handleSendMessage = useCallback(async (content: string, attachments: Attachment[]) => {
    const userMessage: Message = {
      role: 'user',
      content,
      attachments,
      timestamp: Date.now(),
    };

    const newMessages = [...chat.messages, userMessage];
    
    setChat(prev => ({
      ...prev,
      messages: newMessages,
      isLoading: true,
      error: null
    }));

    try {
      const response = await sendChatMessage(newMessages);
      
      const modelMessage: Message = {
        role: 'model',
        content: response || "Desculpe, não consegui processar sua solicitação estrategicamente.",
        timestamp: Date.now(),
      };

      setChat(prev => ({
        ...prev,
        messages: [...prev.messages, modelMessage],
        isLoading: false
      }));
    } catch (err: any) {
      setChat(prev => ({
        ...prev,
        isLoading: false,
        error: "Falha na conexão com o Cérebro Estratégico. Verifique sua chave API ou conexão."
      }));
    }
  }, [chat.messages]);

  const clearChat = () => {
    if (confirm("Deseja realmente limpar todo o histórico estratégico?")) {
      setChat({
        messages: [
          {
            role: 'model',
            content: 'Histórico limpo. Pronto para um novo briefing estratégico.',
            timestamp: Date.now(),
          }
        ],
        isLoading: false,
        error: null,
      });
    }
  };

  return (
    <div className="flex flex-col h-screen gradient-bg overflow-hidden">
      <Header />

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-8 relative" ref={scrollRef}>
        <div className="max-w-4xl mx-auto pb-32">
          {chat.messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}

          {chat.isLoading && (
            <div className="flex justify-start mb-8 animate-pulse">
              <div className="flex-shrink-0 mr-4">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                </div>
              </div>
              <div className="card-glass px-6 py-4 rounded-2xl text-zinc-400 italic text-sm">
                O Cérebro Estratégico está processando seu diagnóstico...
              </div>
            </div>
          )}

          {chat.error && (
            <div className="max-w-md mx-auto mb-8 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-center">
              <p className="text-red-400 text-sm mb-2">{chat.error}</p>
              <button 
                onClick={() => handleSendMessage(chat.messages[chat.messages.length - 1].content, chat.messages[chat.messages.length - 1].attachments || [])}
                className="text-xs font-bold text-white bg-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>

        {/* Floating Controls */}
        <div className="fixed top-24 right-4 flex flex-col space-y-4">
          <button 
            onClick={clearChat}
            className="p-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-zinc-500 hover:text-red-400 rounded-full transition-all shadow-xl"
            title="Limpar Chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Input Area (Sticky Bottom) */}
      <div className="bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent pt-12 pb-6 px-4">
        <ChatInput onSend={handleSendMessage} isLoading={chat.isLoading} />
      </div>

      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
};

export default App;
