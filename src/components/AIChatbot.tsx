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
    content: "Hello! I'm Mumtaz's AI assistant. I can tell you about his skills, experience, projects, and more. What would you like to know?",
    timestamp: new Date(),
  },
];

const KNOWLEDGE_BASE = {
  skills: [
    'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB', 'Tailwind CSS',
    'Next.js', 'Python', 'Docker', 'AWS', 'GraphQL', 'Redis'
  ],
  experience: '5+ years of experience in full-stack web development',
  location: 'Yogyakarta, Indonesia',
  education: 'Bachelor of Computer Science from Universitas Gadjah Mada',
  certifications: ['Google Cloud Professional Architect', 'AWS Solutions Architect', 'Meta Front-End Developer'],
  projects: [
    'E-Commerce Platform with real-time inventory',
    'Task Management App with collaborative features',
    'AI Content Generator using NLP',
    'Social Media Dashboard with analytics'
  ],
  interests: ['Open source contribution', 'Machine Learning', 'Cloud Architecture', 'UI/UX Design'],
  availability: 'Open to freelance projects and full-time opportunities',
};

function generateResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  // Skills related
  if (lowerInput.includes('skill') || lowerInput.includes('tech') || lowerInput.includes('stack')) {
    return `Mumtaz is proficient in: ${KNOWLEDGE_BASE.skills.join(', ')}. He's always learning new technologies to stay current with industry trends.`;
  }
  
  // Experience related
  if (lowerInput.includes('experience') || lowerInput.includes('work') || lowerInput.includes('job')) {
    return `Mumtaz has ${KNOWLEDGE_BASE.experience}. He's worked with startups and enterprise clients, delivering scalable solutions.`;
  }
  
  // Projects related
  if (lowerInput.includes('project') || lowerInput.includes('portfolio')) {
    return `Some of his notable projects include: ${KNOWLEDGE_BASE.projects.join('; ')}. Check out the Projects section for more details!`;
  }
  
  // Education related
  if (lowerInput.includes('education') || lowerInput.includes('degree') || lowerInput.includes('study')) {
    return `Mumtaz holds a ${KNOWLEDGE_BASE.education}. He's also certified in: ${KNOWLEDGE_BASE.certifications.join(', ')}.`;
  }
  
  // Contact related
  if (lowerInput.includes('contact') || lowerInput.includes('hire') || lowerInput.includes('email')) {
    return `You can reach Mumtaz through the contact form on this website or connect with him on LinkedIn. He's ${KNOWLEDGE_BASE.availability.toLowerCase()}.`;
  }
  
  // Location related
  if (lowerInput.includes('location') || lowerInput.includes('where') || lowerInput.includes('from')) {
    return `Mumtaz is based in ${KNOWLEDGE_BASE.location}. He's open to remote work opportunities worldwide.`;
  }
  
  // Greeting
  if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
    return "Hello! Great to meet you! I'm here to help you learn more about Mumtaz. Feel free to ask about his skills, experience, projects, or anything else!";
  }
  
  // Default response
  return "That's an interesting question! Mumtaz is a passionate Full Stack Developer with expertise in modern web technologies. Would you like to know about his technical skills, projects, or how to get in touch with him?";
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
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
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
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-charcoal text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap">
            Chat with AI Assistant
          </div>
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-50 w-[calc(100vw-2rem)] sm:w-96 animate-scale-in">
          <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    AI Assistant
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </h4>
                  <p className="text-gray-400 text-xs">Ask about Mumtaz</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'assistant'
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
                    className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                      message.role === 'assistant'
                        ? 'glass text-white rounded-tl-none'
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
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Mumtaz..."
                  className="flex-1 px-4 py-2 glass rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="px-3 py-1 glass rounded-full text-gray-400 text-xs hover:text-orange-400 hover:border-orange-500/30 transition-colors"
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
