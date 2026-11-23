import React, { useState, useEffect } from 'react';
import { BookOpen, Download, Search, Inbox } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/common/SEO';
import { libraryService } from '@/services/library.service';
import { Book } from '@/types/library.types';

export const LibraryPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await libraryService.getBooks();
      setBooks(data || []);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      (b.subject && b.subject.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <SEO
        title="Elektron kutubxona"
        description="3-Politexnikum elektron darsliklari, o'quv qo'llanmalari va dasturlash bo'yicha ilmiy manbalar."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Elektron kutubxona</h2>
          <p className="text-sm text-muted-foreground">
            O'quv qo'llanmalari, darsliklar va texnik adabiyotlar arxivi (Swagger API)
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kitob yoki muallif..."
            className="pl-9 h-10 text-xs rounded-xl bg-background/50"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-muted-foreground flex justify-center items-center gap-2">
          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Yuklanmoqda...
        </div>
      ) : filteredBooks.length === 0 ? (
        <Card className="py-16 text-center rounded-2xl">
          <CardContent className="space-y-2">
            <Inbox className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
            <p className="text-sm font-semibold text-foreground">Kitoblar topilmadi</p>
            <p className="text-xs text-muted-foreground">Hozircha kutubxona bazasida darsliklar mavjud emas.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className="overflow-hidden flex flex-col justify-between hover:border-primary/50 transition-all rounded-2xl group shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <div>
                {/* Book Cover */}
                <div className="h-44 w-full bg-muted relative overflow-hidden">
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/30 to-indigo-900/30 text-primary">
                      <BookOpen className="h-12 w-12 opacity-40" />
                    </div>
                  )}
                  {book.subject && (
                    <Badge className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-white text-[10px] border-0">
                      {book.subject}
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4 space-y-2">
                  <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
                </CardContent>
              </div>

              <div className="p-4 pt-0">
                <a
                  href={book.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl text-xs gap-1.5 h-9 font-medium group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" /> PDF yuklab olish
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
