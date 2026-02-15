import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm Mumtaz's AI assistant powered by Gemini. I can tell you about his skills, experience, projects, and more. What would you like to know?",
    timestamp: new Date(),
  },
];

const SYSTEM_PROMPT = `You are an AI assistant for Mumtaz Kholafiyan Alfan's personal portfolio website. Your role is to answer questions about Mumtaz in a friendly, professional, and concise manner. You can respond in Bahasa Indonesia if the user writes in Indonesian.

Here is information about Mumtaz:

- Name: Mumtaz Kholafiyan Alfan
- Role: Full Stack Developer
- Location: Yogyakarta, Indonesia
- Experience: 5+ years in full-stack web development
- Education: Bachelor of Computer Science from Universitas Gadjah Mada
- Technical Skills: React, Node.js, TypeScript, PostgreSQL, MongoDB, Tailwind CSS, Next.js, Python, Docker, AWS, GraphQL, Redis, Vue.js, Angular, Express, Prisma, Firebase, Git, Figma, Linux, Nginx, Jest, Vite, Supabase
- Certifications: Google Cloud Professional Architect, AWS Solutions Architect, Meta Front-End Developer
- Notable Projects: 
  1. E-Commerce Platform with real-time inventory
  2. Task Management App with collaborative features
  3. AI Content Generator using NLP
  4. Social Media Dashboard with analytics
- Interests: Open source contribution, Machine Learning, Cloud Architecture, UI/UX Design
- Availability: Open to freelance projects and full-time opportunities
- Contact: Can be reached through the contact form on the website or via LinkedIn

Guidelines:
- Keep responses concise (2-3 sentences max unless more detail is asked)
- Be enthusiastic and professional
- If asked something unrelated to Mumtaz, politely redirect to topics about him
- Use a friendly, conversational tone
- Match the language the user uses (if they write in Indonesian, respond in Indonesian)
- Do not make up information not listed above
- Always base your answers strictly on the data provided above`;

async function callGeminiAPI(userMessage: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('Gemini API key not configured, using fallback responses');
    return getFallbackResponse(userMessage);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${SYSTEM_PROMPT}\n\nUser message: ${userMessage}` }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return getFallbackResponse(userMessage);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('No text in Gemini response:', JSON.stringify(data));
      return getFallbackResponse(userMessage);
    }

    return text.trim();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return getFallbackResponse(userMessage);
  }
}

function getFallbackResponse(input: string): string {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('skill') || lowerInput.includes('tech') || lowerInput.includes('stack')) {
    return 'Mumtaz is proficient in: React, Node.js, TypeScript, PostgreSQL, MongoDB, Tailwind CSS, Next.js, Python, Docker, AWS, GraphQL, Redis. He\'s always learning new technologies!';
  }
  if (lowerInput.includes('experience') || lowerInput.includes('work') || lowerInput.includes('job')) {
    return 'Mumtaz has 5+ years of experience in full-stack web development. He\'s worked with startups and enterprise clients, delivering scalable solutions.';
  }
  if (lowerInput.includes('project') || lowerInput.includes('portfolio')) {
    return 'Some notable projects include: E-Commerce Platform with real-time inventory, Task Management App, AI Content Generator using NLP, and Social Media Dashboard.';
  }
  if (lowerInput.includes('education') || lowerInput.includes('degree') || lowerInput.includes('study')) {
    return 'Mumtaz holds a Bachelor of Computer Science from Universitas Gadjah Mada. He\'s also certified as a Google Cloud Professional Architect, AWS Solutions Architect, and Meta Front-End Developer.';
  }
  if (lowerInput.includes('contact') || lowerInput.includes('hire') || lowerInput.includes('email')) {
    return 'You can reach Mumtaz through the contact form on this website or connect with him on LinkedIn. He\'s open to freelance projects and full-time opportunities.';
  }
  if (lowerInput.includes('location') || lowerInput.includes('where') || lowerInput.includes('from')) {
    return 'Mumtaz is based in Yogyakarta, Indonesia. He\'s open to remote work opportunities worldwide.';
  }
  if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey') || lowerInput.includes('halo')) {
    return "Hello! Great to meet you! I'm here to help you learn more about Mumtaz. Feel free to ask about his skills, experience, projects, or anything else!";
  }
  return "That's an interesting question! Mumtaz is a passionate Full Stack Developer with expertise in modern web technologies. Would you like to know about his technical skills, projects, or how to get in touch?";
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setIsTyping(true);

    try {
      const response = await callGeminiAPI(userInput);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment!",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-50 group"
          aria-label="Open AI Chat"
        >
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-30" />

          {/* Button */}
          <div className="relative w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-glow-strong hover:scale-110 transition-transform duration-300">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>

          {/* Badge */}
          <div className="absolute -top-1 -right-1 px-2 py-0.5 bg-cyan-500 text-white text-[10px] font-medium rounded-full">
            Ask me
          </div>

          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap">
            Chat with AI Assistant
          </div>
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-50 w-[calc(100vw-2rem)] sm:w-96 animate-scale-in">
          <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-black/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold flex items-center gap-2">
                    AI Assistant
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </h4>
                  <p className="text-gray-500 text-xs">Powered by Gemini</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'assistant'
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500'
                    : 'bg-cyan-500'
                    }`}>
                    {message.role === 'assistant' ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-sm ${message.role === 'assistant'
                      ? 'glass text-gray-900 rounded-tl-none'
                      : 'bg-orange-500 text-white rounded-tr-none'
                      }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-black/10">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Mumtaz..."
                  className="flex-1 px-4 py-2 glass rounded-xl text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-2 mt-3">
                {['Skills?', 'Projects?', 'Experience?', 'Contact?'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1 glass rounded-full text-gray-600 text-xs hover:text-orange-400 hover:border-orange-500/30 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
