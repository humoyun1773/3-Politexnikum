import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SEO } from '@/components/common/SEO';
import { chatService } from '@/services/chat.service';
import { ChatMessage } from '@/types/chat.types';
import { useAuth } from '@/context/AuthContext';
import { formatTime } from '@/lib/utils';

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await chatService.getMessages();
      setMessages(data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      const newMsg = await chatService.sendMessage({ text: textToSend });
      setMessages((prev) => [...prev, newMsg]);
    } catch (err: any) {
      alert("Xabar yuborishda xatolik yuz berdi");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <SEO
        title="Guruh chat"
        description="3-Politexnikum talabalari o'rtasidagi guruh muloqot xonasi va o'quv muhokamalari."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Guruh muloqoti</h2>
          <p className="text-sm text-muted-foreground">
            Swagger REST API orqali guruhdoshlar va o'qituvchilar bilan muloqot
          </p>
        </div>
      </div>

      <Card className="h-[620px] flex flex-col shadow-sm rounded-3xl border-border/80 overflow-hidden">
        {/* Chat Header */}
        <CardHeader className="py-3.5 px-6 border-b border-border/80 bg-muted/20 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                Guruh Muloqot Kanali
              </CardTitle>
              <CardDescription className="text-xs">
                {user?.group ? `${user.group} Guruhi` : 'Umumiy talabalar suhbati'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {/* Messages Scroll Area */}
        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-background/40">
          {loading ? (
            <div className="py-20 text-center text-xs text-muted-foreground flex justify-center items-center gap-2">
              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Yuklanmoqda...
            </div>
          ) : messages.length === 0 ? (
            <div className="py-20 text-center text-xs text-muted-foreground flex flex-col items-center justify-center space-y-2">
              <MessageSquare className="h-10 w-10 opacity-30 text-muted-foreground" />
              <p className="font-semibold text-sm">Hozircha xabarlar yo'q</p>
              <p>Birinchi bo'lib suhbatni boshlang!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.is_me || (user && msg.sender === user.id);
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <Avatar className="h-8 w-8 ring-1 ring-border shrink-0">
                      <AvatarImage src={msg.avatar} alt={msg.sender_name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {msg.sender_name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-xs sm:max-w-md rounded-2xl px-4 py-2.5 shadow-xs space-y-1 ${
                      isMe
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-br-xs shadow-md shadow-indigo-500/20'
                        : 'bg-card border border-border text-foreground rounded-bl-xs'
                    }`}
                  >
                    {!isMe && (
                      <p className="text-[11px] font-bold text-primary truncate">
                        {msg.sender_name}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <p
                      className={`text-[10px] text-right font-mono ${
                        isMe ? 'text-white/80' : 'text-muted-foreground'
                      }`}
                    >
                      {msg.created_at ? formatTime(msg.created_at.slice(11, 16)) : ''}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Message Input Footer */}
        <div className="p-3 sm:p-4 border-t border-border/80 bg-card">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Xabar yozing..."
              className="flex-1 h-11 rounded-xl text-xs sm:text-sm px-4 bg-background/50 border-border"
              disabled={isSending}
            />
            <Button
              type="submit"
              variant="gradient"
              size="icon"
              className="h-11 w-11 rounded-xl shrink-0 shadow-md shadow-indigo-500/25"
              disabled={isSending || !inputText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
