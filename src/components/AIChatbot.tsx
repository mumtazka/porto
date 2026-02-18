import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { getPersonalContext } from '../hooks/useSupabase';

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

/** Build a fresh system prompt from localStorage context + live portfolio data */
function buildSystemPrompt(): string {
  const ctx = getPersonalContext();

  // Read live data from localStorage (written by the hooks)
  let projectsText = '';
  try {
    const raw = localStorage.getItem('portfolio_projects');
    if (raw) {
      const projects = JSON.parse(raw) as Array<{ title: string; description: string; tech_stack: string[]; featured: boolean }>;
      projectsText = projects
        .map(p => `  - ${p.title}${p.featured ? ' ⭐' : ''}: ${p.description} [Tech: ${p.tech_stack.join(', ')}]`)
        .join('\n');
    }
  } catch { }

  let educationText = '';
  try {
    const raw = localStorage.getItem('portfolio_education');
    if (raw) {
      const edu = JSON.parse(raw) as Array<{ institution: string; degree: string; field: string; start_date: string; end_date: string }>;
      educationText = edu
        .map(e => `  - ${e.degree} in ${e.field} @ ${e.institution} (${e.start_date.slice(0, 4)}–${e.end_date.slice(0, 4)})`)
        .join('\n');
    }
  } catch { }

  let achievementsText = '';
  try {
    const raw = localStorage.getItem('portfolio_achievements');
    if (raw) {
      const ach = JSON.parse(raw) as Array<{ title: string; issuer: string; date: string }>;
      achievementsText = ach
        .map(a => `  - ${a.title} by ${a.issuer} (${a.date.slice(0, 4)})`)
        .join('\n');
    }
  } catch { }

  return `You are an AI assistant for ${ctx.name}'s personal portfolio website. Your role is to answer questions about ${ctx.name} in a friendly, professional, and concise manner. You can respond in Bahasa Indonesia if the user writes in Indonesian.

Here is the most up-to-date information about ${ctx.name}:

PERSONAL INFO:
- Full Name: ${ctx.name}
- Role / Title: ${ctx.role}
- Location: ${ctx.location}
- Years of Experience: ${ctx.yearsOfExperience}
- Bio: ${ctx.bio}
- Availability: ${ctx.availability}
- Languages spoken: ${ctx.languages}

CONTACT:
- Email: ${ctx.email}
- Phone: ${ctx.phone}
- LinkedIn: ${ctx.linkedin}
- GitHub: ${ctx.github}
- Instagram: ${ctx.instagram}

TECHNICAL SKILLS:
${ctx.skills}

INTERESTS:
${ctx.interests}

${projectsText ? `PROJECTS:\n${projectsText}` : ''}

${educationText ? `EDUCATION & CERTIFICATIONS:\n${educationText}` : ''}

${achievementsText ? `ACHIEVEMENTS:\n${achievementsText}` : ''}

${ctx.extraNotes ? `ADDITIONAL NOTES:\n${ctx.extraNotes}` : ''}

GUIDELINES:
- Keep responses concise (2-3 sentences max unless more detail is asked)
- Be enthusiastic and professional
- If asked something unrelated to ${ctx.name}, politely redirect to topics about him
- Use a friendly, conversational tone
- Match the language the user uses (if they write in Indonesian, respond in Indonesian)
- Do not make up information not listed above
- Always base your answers strictly on the data provided above`;
}

async function callGeminiAPI(userMessage: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('Gemini API key not configured, using fallback responses');
    return getFallbackResponse(userMessage);
  }

  const systemPrompt = buildSystemPrompt();

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser message: ${userMessage}` }],
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
  const ctx = getPersonalContext();
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('skill') || lowerInput.includes('tech') || lowerInput.includes('stack')) {
    return `${ctx.name} is proficient in: ${ctx.skills}. Always learning new technologies!`;
  }
  if (lowerInput.includes('experience') || lowerInput.includes('work') || lowerInput.includes('job')) {
    return `${ctx.name} has ${ctx.yearsOfExperience} years of experience as a ${ctx.role}. ${ctx.availability}.`;
  }
  if (lowerInput.includes('project') || lowerInput.includes('portfolio')) {
    try {
      const raw = localStorage.getItem('portfolio_projects');
      if (raw) {
        const projects = JSON.parse(raw) as Array<{ title: string; featured: boolean }>;
        const featured = projects.filter(p => p.featured).map(p => p.title);
        if (featured.length) return `Featured projects include: ${featured.join(', ')}. Check the Projects section for details!`;
      }
    } catch { }
    return `${ctx.name} has worked on various exciting projects. Check the Projects section to see them all!`;
  }
  if (lowerInput.includes('education') || lowerInput.includes('degree') || lowerInput.includes('study') || lowerInput.includes('certificate')) {
    try {
      const raw = localStorage.getItem('portfolio_education');
      if (raw) {
        const edu = JSON.parse(raw) as Array<{ institution: string; degree: string }>;
        if (edu.length) return `${ctx.name}'s education includes: ${edu.map(e => `${e.degree} from ${e.institution}`).join('; ')}.`;
      }
    } catch { }
    return `${ctx.name} has a strong academic background. Check the Education section for full details.`;
  }
  if (lowerInput.includes('contact') || lowerInput.includes('hire') || lowerInput.includes('email')) {
    return `You can reach ${ctx.name} at ${ctx.email} or through the contact form on this website. ${ctx.availability}.`;
  }
  if (lowerInput.includes('location') || lowerInput.includes('where') || lowerInput.includes('from')) {
    return `${ctx.name} is based in ${ctx.location}. Open to remote work opportunities worldwide.`;
  }
  if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey') || lowerInput.includes('halo')) {
    return `Hello! Great to meet you! I'm here to help you learn more about ${ctx.name}. Feel free to ask about skills, experience, projects, or how to get in touch!`;
  }
  return `${ctx.name} is a passionate ${ctx.role} with expertise in modern web technologies. Would you like to know about skills, projects, or how to get in touch?`;
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
                  <p className="text-gray-500 text-xs">Powered by Gemini · Live context</p>
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
