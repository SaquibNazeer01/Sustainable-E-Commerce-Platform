
import React, { useState, useRef, useEffect } from 'react';
import { ChatIcon, CloseIcon, SendIcon, LeafIcon } from './Icons';
import type { ChatMessage } from '../types';


const EcoBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Predefined sustainability Q&A pairs for EcoBot
  const predefinedResponses: { question: string; keywords: string[]; response: string }[] = [
    {
      question: 'What makes this e-commerce platform sustainable?',
      keywords: ['sustainable', 'eco-conscious', 'principles', 'ethically', 'carbon-neutral', 'fair trade', 'zero-waste'],
      response: 'Our platform is built on eco-conscious principles — from sourcing ethically made products and using carbon-neutral logistics to supporting brands that follow fair trade and zero-waste policies.',
    },
    {
      question: 'Do you offer eco-friendly packaging?',
      keywords: ['packaging', 'eco-friendly packaging', 'biodegradable', 'recyclable', 'reusable packaging'],
      response: 'Yes, all our orders are shipped using biodegradable, recyclable, or reusable packaging materials to minimize plastic waste and promote a circular economy.',
    },
    {
      question: 'How do you verify that products are truly sustainable?',
      keywords: ['verify', 'sustainable', 'certified', 'transparency', 'organic', 'vegan', 'cruelty-free', 'carbon-neutral'],
      response: 'We partner only with certified eco-friendly brands and conduct strict sustainability audits. Each product listing includes transparency tags like Organic, Vegan, Cruelty-Free, or Carbon-Neutral.',
    },
    {
      question: 'Are your delivery methods environmentally friendly?',
      keywords: ['delivery', 'environmentally friendly', 'carbon-neutral couriers', 'local delivery', 'shipping'],
      response: 'Absolutely! We prioritize carbon-neutral couriers, local delivery networks, and optimized shipping routes to significantly reduce transportation emissions.',
    },
    {
      question: 'Can I track the carbon footprint of my order?',
      keywords: ['carbon footprint', 'track', 'order', 'offset'],
      response: 'Yes, you can! Each order summary includes an estimated carbon footprint, along with suggestions to offset it through verified environmental initiatives.',
    },
    {
      question: 'What steps are you taking to reduce waste?',
      keywords: ['reduce waste', 'waste', 'eco-packaging', 'upcycled', 'recycle', 'reuse'],
      response: 'We actively minimize waste through eco-packaging, promoting upcycled products, and encouraging customers to recycle or return used packaging for reuse.',
    },
    {
      question: 'Do you support local or small-scale businesses?',
      keywords: ['local', 'small-scale', 'artisans', 'community', 'brands'],
      response: 'Yes, we proudly feature local artisans, small sustainable brands, and community-driven initiatives to help build greener local economies.',
    },
    {
      question: 'What can customers do to shop more sustainably here?',
      keywords: ['shop sustainably', 'sustainably', 'eco tips', 'labels', 'low-emission', 'responsible'],
      response: 'You can filter products by sustainability labels, choose low-emission delivery options, and explore our “Eco Tips” section for responsible consumption practices.',
    },
    {
      question: 'Is your website powered by renewable energy?',
      keywords: ['website', 'renewable energy', 'green data centers', 'servers'],
      response: 'Yes, our servers are hosted on green data centers powered by renewable energy sources to ensure minimal environmental impact from digital operations.',
    },
    {
      question: 'Do you run any eco-awareness or recycling programs?',
      keywords: ['eco-awareness', 'recycling programs', 'greenback', 'return', 'awareness', 'sustainability challenges'],
      response: 'We do! Our ‘GreenBack Program’ allows customers to return used packaging for reuse or recycling. We also organize monthly awareness drives and sustainability challenges.',
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setMessages([
        { role: 'model', content: "Hi! I'm EcoBot. Type 'help' to see available commands, or ask a sustainability question! 🌱" }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (customInput?: string) => {
    const sendText = typeof customInput === 'string' ? customInput : input;
    if (sendText.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: sendText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Help command
    if (sendText.trim().toLowerCase() === 'help') {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'model', content: 'Available questions:' }]);
        setIsLoading(false);
      }, 400);
      return;
    }

    // Find a relevant predefined response
    const lowerInput = sendText.toLowerCase();
    let response = 'Sorry, I do not have an answer for that. Try asking one of the available questions (type help)!';
    for (const entry of predefinedResponses) {
      if (
        entry.keywords.some(keyword => lowerInput.includes(keyword)) ||
        lowerInput === entry.question.toLowerCase()
      ) {
        response = entry.response;
        break;
      }
    }
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'model', content: response }]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-brand-green hover:bg-brand-green-dark text-white rounded-full p-4 shadow-lg shadow-brand-green/30 hover:shadow-brand-green/50 transition-all duration-300 transform hover:scale-110 z-50"
        aria-label="Open EcoBot"
      >
        {isOpen ? <CloseIcon className="h-8 w-8" /> : <ChatIcon className="h-8 w-8" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-32 right-6 w-full max-w-lg h-[80vh] bg-dark-green/80 backdrop-blur-xl rounded-lg shadow-2xl shadow-black/50 flex flex-col animate-fade-in z-50 border border-brand-green/20">
          <header className="p-4 border-b border-brand-green/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <LeafIcon className="h-6 w-6 text-brand-green" />
              <h3 className="font-bold text-lg font-orbitron">EcoBot Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <CloseIcon className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-brand-green text-dark-green rounded-br-none' : 'bg-gray-700 text-white rounded-bl-none'}`}>
                  <p className="text-sm">{msg.content}</p>
                  {/* Show available questions as clickable buttons if the bot just listed them */}
                  {msg.content === 'Available questions:' && (
                    <div className="mt-3 flex flex-col gap-2 items-start">
                      {predefinedResponses.map((entry, i) => (
                        <button
                          key={i}
                          className="bg-brand-green text-dark-green px-3 py-1 rounded shadow hover:bg-brand-green-light transition text-xs text-left"
                          onClick={() => handleSend(entry.question)}
                        >
                          {entry.question}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-brand-green/20">
            <div className="flex items-center bg-gray-900/50 rounded-lg">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a sustainability question..."
                className="flex-1 bg-transparent p-3 text-white placeholder-gray-400 focus:outline-none"
                disabled={isLoading}
              />
              <button onClick={handleSend} disabled={isLoading} className="p-3 text-brand-green disabled:text-gray-500 hover:text-brand-green-light transition">
                <SendIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EcoBot;
