import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sendCustomerChatMessageApi } from '../../services/api';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  suggestedActions?: { label: string; action: string; payload?: string }[];
}

export const CustomerChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Namaste! Welcome to SUJJU FOODS. How can I assist you today? Ask me about order tracking, 24h delivery SLA, ₹180 tea pricing, or subscriptions.',
      suggestedActions: [
        { label: 'Check Order Status', action: 'QUERY', payload: 'Track my order status' },
        { label: 'Price & 0% GST Info', action: 'QUERY', payload: 'What is the price and GST rate?' },
        { label: 'Pincode Serviceability', action: 'QUERY', payload: 'Is 530016 serviceable?' },
        { label: 'Subscribe Monthly', action: 'NAVIGATE', payload: '/customer/subscriptions' },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await sendCustomerChatMessageApi(text.trim());
      if (res?.success && res?.response) {
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: res.response.reply,
          suggestedActions: res.response.suggestedActions,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          text: 'Thank you for reaching out. Our support desk is also available directly at support@sujjufoods.com or phone +91 94401 22334.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: { label: string; action: string; payload?: string }) => {
    if (action.action === 'NAVIGATE' && action.payload) {
      navigate(action.payload);
      setIsOpen(false);
    } else if (action.action === 'QUERY' && action.payload) {
      handleSend(action.payload);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="sujju-gradient hover:shadow-2xl text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 group relative border-2 border-sujju-gold"
            aria-label="Open SUJJU Customer Support Chatbot"
          >
            <MessageSquare className="w-6 h-6 text-sujju-gold" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
          </button>
        ) : null}
      </div>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[540px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="sujju-gradient text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Bot className="w-5 h-5 text-sujju-gold" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-serif leading-tight">SUJJU Assistant</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Online • Instant Delivery Help</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conversation Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/60 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-sujju-green text-sujju-gold flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="max-w-[80%] space-y-2">
                  <div
                    className={`p-3 rounded-2xl leading-relaxed whitespace-pre-line shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-sujju-green text-white rounded-tr-none'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Suggested Action Chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedActions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(act)}
                          className="px-2.5 py-1 bg-white border border-gray-200 hover:border-sujju-gold text-sujju-green rounded-full text-[11px] font-semibold transition shadow-2xs hover:bg-sujju-gold/10"
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-sujju-gold text-sujju-green-950 flex items-center justify-center flex-shrink-0 mt-1 font-bold text-[10px]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-gray-400 text-xs italic">
                <Bot className="w-4 h-4 animate-spin text-sujju-gold" />
                <span>Checking records...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about order tracking, tea price..."
              className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-sujju-green focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-sujju-green hover:bg-sujju-green-800 text-white rounded-xl transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
