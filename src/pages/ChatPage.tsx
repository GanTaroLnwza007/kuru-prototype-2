import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, BookOpen } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { programs } from '@/data/programs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { label: string; page: number }[];
}

const mockResponses: Record<string, { th: string; en: string; sources: { label: string; page: number }[] }[]> = {
  default: [
    {
      th: 'หลักสูตรวิทยาการคอมพิวเตอร์ของ มก. เน้นพัฒนาทักษะด้านการเขียนโปรแกรม AI และระบบฐานข้อมูล โดยมี PLO ครอบคลุมทั้งทฤษฎีและปฏิบัติ นักศึกษาจะได้เรียนรู้ผ่านโครงงานจริงและการฝึกงานกับบริษัทชั้นนำ',
      en: 'The KU Computer Science program focuses on programming, AI, and database systems. PLOs cover both theory and practice. Students learn through real projects and internships with leading companies.',
      sources: [{ label: 'มคอ.2', page: 12 }, { label: 'มคอ.2', page: 45 }],
    },
    {
      th: 'สำหรับเกณฑ์การรับเข้า TCAS รอบ 3 ของสาขาวิทยาการคอมพิวเตอร์ ใช้คะแนน TGAT 20% TPAT3 30% A-Level คณิตศาสตร์ 30% และ A-Level ฟิสิกส์ 20% โดยต้องมี GPAX ไม่ต่ำกว่า 2.50',
      en: 'For TCAS Round 3 admission to Computer Science: TGAT 20%, TPAT3 30%, A-Level Math 30%, and A-Level Physics 20%. Minimum GPAX is 2.50.',
      sources: [{ label: 'ประกาศรับสมัคร', page: 3 }, { label: 'มคอ.2', page: 8 }],
    },
  ],
};

const ChatPage = () => {
  const { lang, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const programId = searchParams.get('program');
  const program = programId ? programs.find(p => p.id === programId) : null;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Welcome message
    const welcome: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: program
        ? lang === 'th'
          ? `สวัสดี! ฉันคือ KUru 🎓 พร้อมตอบคำถามเกี่ยวกับสาขา${program.name.th} (${program.faculty.th}) ได้เลย!`
          : `Hi! I'm KUru 🎓 Ready to answer questions about ${program.name.en} (${program.faculty.en})!`
        : t.chat.welcome,
    };
    setMessages([welcome]);
  }, [program, lang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const pool = mockResponses.default;
      const resp = pool[Math.floor(Math.random() * pool.length)];
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: resp[lang],
        sources: resp.sources,
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card px-4 py-3">
        <div className="container max-w-3xl mx-auto flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-hero text-primary-foreground font-bold text-lg">K</div>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground">{t.chat.title}</h1>
            <p className="text-xs text-muted-foreground">
              {program ? `${program.name[lang]} · ${program.faculty[lang]}` : t.chat.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="container max-w-3xl mx-auto py-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-hero text-primary-foreground text-sm font-bold mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'order-first' : ''}`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted text-foreground rounded-bl-md'
                  }`}>
                    {msg.content}
                  </div>
                  {/* Source Citations */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((s, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] gap-1 px-2 py-0.5 text-muted-foreground">
                          <BookOpen className="h-3 w-3" />
                          {s.label} {t.chat.source} {lang === 'th' ? 'หน้า' : 'Page'} {s.page}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-bold mt-1">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-hero text-primary-foreground text-sm font-bold">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-card px-4 py-3">
        <div className="container max-w-3xl mx-auto flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={t.chat.placeholder}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim() || isTyping} className="gradient-hero text-primary-foreground shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
