import { Search, BookOpen, User, Calendar, FileText, Layers, X, MessageCircle, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useBookSearch, useBookDetails, getCoverUrl } from '@/services/bookService';
import { useBookStore } from '@/stores/bookStore';
import type { Comment } from '@/stores/bookStore';

export default function BookSearch() {
    const { searchQuery, setSearchQuery, selectedBook, setSelectedBook, comments, addComment } = useBookStore();
    const [localQuery, setLocalQuery] = useState(searchQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const [newComment, setNewComment] = useState('');
    const commentSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(localQuery), 300);

        return () => clearTimeout(timer);
    }, [localQuery]);

    useEffect(() => {
        setSearchQuery(debouncedQuery);
    }, [debouncedQuery, setSearchQuery]);

    const { data: searchResults, isLoading } = useBookSearch(debouncedQuery);
    const { data: bookDetails } = useBookDetails(selectedBook?.key || null);

    const handleBookClick = (key: string, title: string, cover_i?: number, first_publish_year?: number) => {
        setSelectedBook({
            key,
            title,
            cover_i,
            first_publish_year,
        });
    };

    const handleAddComment = () => {
        if (!newComment.trim()) {
return;
}

        const comment: Comment = {
            id: Date.now().toString(),
            author: 'You',
            content: newComment,
            date: new Date().toISOString().split('T')[0],
            avatar: 'Y',
        };

        addComment(comment);
        setNewComment('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Book Explorer
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Search millions of books from Open Library
                    </p>
                </div>

                <div className="relative mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search by title, author, or ISBN..."
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            className="pl-12 h-14 text-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-xl shadow-lg"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
                            <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-indigo-600" />
                                    Search Results
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[600px]">
                                    {isLoading ? (
                                        <div className="p-4 space-y-3">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="h-20 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
                                            ))}
                                        </div>
                                    ) : searchResults && searchResults.length > 0 ? (
                                        <div className="p-2">
                                            {searchResults.map((book) => (
                                                <button
                                                    key={book.key}
                                                    onClick={() =>
                                                        handleBookClick(
                                                            book.key,
                                                            book.title,
                                                            book.cover_i,
                                                            book.first_publish_year
                                                        )
                                                    }
                                                    className={`w-full text-left p-3 rounded-lg transition-all hover:bg-slate-100 dark:hover:bg-slate-700 ${
                                                        selectedBook?.key === book.key
                                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-500'
                                                            : 'border-2 border-transparent'
                                                    }`}
                                                >
                                                    <div className="flex gap-3">
                                                        {book.cover_i ? (
                                                            <img
                                                                src={getCoverUrl(book.cover_i, 'S') || ''}
                                                                alt={book.title}
                                                                className="w-12 h-16 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-16 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center">
                                                                <BookOpen className="h-6 w-6 text-slate-400" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium truncate text-sm">
                                                                {book.title}
                                                            </p>
                                                            {book.author_name?.[0] && (
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                                    {book.author_name[0]}
                                                                </p>
                                                            )}
                                                            {book.first_publish_year && (
                                                                <p className="text-xs text-slate-400">
                                                                    {book.first_publish_year}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : debouncedQuery ? (
                                        <div className="p-8 text-center text-slate-500">
                                            No books found. Try a different search.
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-slate-500">
                                            Start typing to search for books.
                                        </div>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        {selectedBook ? (
                            <div className="space-y-6">
                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
                                    <CardContent className="p-6">
                                        <div className="flex gap-6">
                                            <div className="shrink-0">
                                                {selectedBook.cover_i ? (
                                                    <img
                                                        src={getCoverUrl(selectedBook.cover_i, 'L') || ''}
                                                        alt={selectedBook.title}
                                                        className="w-48 rounded-lg shadow-lg"
                                                    />
                                                ) : (
                                                    <div className="w-48 h-64 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                                                        <BookOpen className="h-16 w-16 text-slate-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-2xl font-bold mb-2">
                                                    {selectedBook.title}
                                                </h2>
                                                {bookDetails?.authors?.map((author, index) => (
                                                    <div key={index} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4">
                                                        <User className="h-4 w-4" />
                                                        <span>{author.author.key}</span>
                                                    </div>
                                                ))}
                                                {selectedBook.first_publish_year && (
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>First published: {selectedBook.first_publish_year}</span>
                                                    </div>
                                                )}
                                                {bookDetails?.publish_date && (
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>Published: {bookDetails.publish_date}</span>
                                                    </div>
                                                )}
                                                {bookDetails?.number_of_pages && (
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4">
                                                        <FileText className="h-4 w-4" />
                                                        <span>{bookDetails.number_of_pages} pages</span>
                                                    </div>
                                                )}
                                                {bookDetails?.subjects?.slice(0, 5).map((subject, index) => (
                                                    <Badge key={index} variant="secondary" className="mr-1 mb-1">
                                                        {subject}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setSelectedBook(null)}
                                                className="shrink-0"
                                            >
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </div>
                                        {bookDetails?.description && (
                                            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    Description
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                                    {typeof bookDetails.description === 'object'
                                                        ? bookDetails.description.value
                                                        : bookDetails.description}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <div ref={commentSectionRef}>
                                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
                                        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                                            <CardTitle className="flex items-center gap-2">
                                                <MessageCircle className="h-5 w-5 text-indigo-600" />
                                                Comments ({comments.length})
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="mb-6">
                                                <Textarea
                                                    placeholder="Write your comment..."
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    className="min-h-[100px] resize-none"
                                                />
                                                <Button
                                                    onClick={handleAddComment}
                                                    className="mt-2"
                                                    disabled={!newComment.trim()}
                                                >
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Post Comment
                                                </Button>
                                            </div>

                                            <ScrollArea className="h-[300px]">
                                                <div className="space-y-4">
                                                    {comments.map((comment) => (
                                                        <div
                                                            key={comment.id}
                                                            className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                                                        >
                                                            <Avatar>
                                                                <AvatarFallback>
                                                                    {comment.avatar}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-semibold">
                                                                        {comment.author}
                                                                    </span>
                                                                    <span className="text-xs text-slate-500">
                                                                        {comment.date}
                                                                    </span>
                                                                </div>
                                                                <p className="text-slate-600 dark:text-slate-300">
                                                                    {comment.content}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ) : (
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
                                <CardContent className="p-12 text-center">
                                    <Layers className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                                    <h3 className="text-xl font-semibold mb-2">
                                        Select a Book
                                    </h3>
                                    <p className="text-slate-500">
                                        Choose a book from the search results to view its details and comments.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
