import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Calendar, FileText, Bell, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { searchService } from '@/services/student.service';
import { Lesson, Assignment, Book, Announcement } from '@/types/api.types';

interface GlobalSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    lessons: Lesson[];
    assignments: Assignment[];
    books: Book[];
    announcements: Announcement[];
  }>({ lessons: [], assignments: [], books: [], announcements: [] });
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults({ lessons: [], assignments: [], books: [], announcements: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchService.search(query);
        setResults(res);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  const hasResults =
    results.lessons.length > 0 ||
    results.assignments.length > 0 ||
    results.books.length > 0 ||
    results.announcements.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl gap-0 border-border/80">
        <div className="flex items-center px-4 border-b border-border bg-card">
          <Search className="h-5 w-5 text-muted-foreground shrink-0 mr-3" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Fan, topshiriq, o'qituvchi yoki kitob qidirish..."
            className="h-14 border-0 shadow-none focus-visible:ring-0 text-base px-0"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Qidiruv so'zini kiriting (masalan: "React", "SQL", "Nazorat", "Hakimov")...
            </div>
          )}

          {query && !isSearching && !hasResults && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              "{query}" bo'yicha hech narsa topilmadi.
            </div>
          )}

          {results.lessons.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-1.5">
                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                <span>Darslar & Fanlar</span>
              </div>
              <div className="space-y-1">
                {results.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    onClick={() => handleSelect('/schedule')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent cursor-pointer group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {lesson.subject}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lesson.teacher} • {lesson.room} • {lesson.weekday_name}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.assignments.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-1.5">
                <FileText className="h-3.5 w-3.5 text-amber-500" />
                <span>Topshiriqlar</span>
              </div>
              <div className="space-y-1">
                {results.assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    onClick={() => handleSelect('/assignments')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent cursor-pointer group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {assignment.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {assignment.subject} • {assignment.kind_display} • {assignment.days_left}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.books.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-1.5">
                <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                <span>Kutubxona</span>
              </div>
              <div className="space-y-1">
                {results.books.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => handleSelect('/library')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent cursor-pointer group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {book.title}
                      </p>
                      <p className="text-xs text-muted-foreground">Muallif: {book.author}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.announcements.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-1.5">
                <Bell className="h-3.5 w-3.5 text-purple-500" />
                <span>E'lonlar</span>
              </div>
              <div className="space-y-1">
                {results.announcements.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect('/announcements')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent cursor-pointer group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.text}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
