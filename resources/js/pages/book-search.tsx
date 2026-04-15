import { Search, BookOpen, Calendar, FileText, Layers, X, MessageCircle, Send, Star, Bookmark, Library, User, Building, Globe, BookMarked } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useBookSearch, useBookDetails, useBookEditions, getCoverUrl } from '@/services/bookService';
import { useBookStore } from '@/stores/bookStore';
import type { Comment } from '@/stores/bookStore';
import { book as bookRoute } from '@/routes';

export default function BookSearch() {
    const { searchQuery, setSearchQuery, selectedBook, setSelectedBook, comments, addComment } = useBookStore();
    const [localQuery, setLocalQuery] = useState(searchQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(localQuery), 300);

        return () => clearTimeout(timer);
    }, [localQuery]);

    useEffect(() => {
        setSearchQuery(debouncedQuery);
    }, [debouncedQuery, setSearchQuery]);

    const { data: searchResults, isLoading } = useBookSearch(debouncedQuery);
    const { data: bookDetails } = useBookDetails(selectedBook?.key || null);
    const { data: editions } = useBookEditions(selectedBook?.key || null);

    const firstBook = useMemo(() => {
        return searchResults && searchResults.length > 0 ? searchResults[0] : null;
    }, [searchResults]);

    useEffect(() => {
        if (firstBook && !selectedBook) {
            setSelectedBook({
                key: firstBook.key,
                title: firstBook.title,
                cover_i: firstBook.cover_i,
                first_publish_year: firstBook.first_publish_year,
            });
        }
    }, [firstBook, selectedBook, setSelectedBook]);

    const handleAddComment = () => {
        if (!newComment.trim() || newComment.length > 500) {
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

    const handleBookClick = (key: string, title: string, cover_i?: number, first_publish_year?: number) => {
        setSelectedBook({
            key,
            title,
            cover_i,
            first_publish_year,
        });
    };

    const authors = bookDetails?.authors?.map((a) => a.author.key) || [];
    const publishers = bookDetails?.publishers || [];
    const publishDate = bookDetails?.publish_date || selectedBook?.first_publish_year?.toString();
    const pages = bookDetails?.number_of_pages || selectedBook?.number_of_pages_median;
    const subjects = bookDetails?.subjects || [];
    const firstSentence = bookDetails?.first_sentence?.[0];
    const isbns = [...(bookDetails?.isbn_10 || []), ...(bookDetails?.isbn_13 || [])];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                        <Library className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                        Book Explorer
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Discover millions of books from Open Library
                    </p>
                </div>

                <div className="relative mb-10 max-w-2xl mx-auto">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <Input
                            type="text"
                            placeholder="Search by title, author, ISBN..."
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            className="pl-14 h-14 text-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none transition-all duration-200"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 xl:col-span-3">
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl overflow-hidden">
                            <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <BookOpen className="h-5 w-5 text-indigo-600" />
                                    Results
                                </CardTitle>
                                <CardDescription>
                                    {searchResults ? `${searchResults.length} books found` : 'Search for books'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[500px] lg:h-[650px]">
                                    {isLoading ? (
                                        <div className="p-4 space-y-3">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="flex gap-3 p-3">
                                                    <Skeleton className="w-14 h-20 rounded-lg" />
                                                    <div className="flex-1 space-y-2">
                                                        <Skeleton className="h-4 w-full" />
                                                        <Skeleton className="h-3 w-2/3" />
                                                        <Skeleton className="h-3 w-1/3" />
                                                    </div>
                                                </div>
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
                                                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 ${
                                                        selectedBook?.key === book.key
                                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-500 shadow-md'
                                                            : 'border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-600'
                                                    }`}
                                                >
                                                    <div className="flex gap-3">
                                                        {book.cover_i ? (
                                                            <img
                                                                src={getCoverUrl(book.cover_i, 'S') || ''}
                                                                alt={book.title}
                                                                className="w-14 h-20 object-cover rounded-lg shadow-sm"
                                                            />
                                                        ) : (
                                                            <div className="w-14 h-20 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <BookOpen className="h-6 w-6 text-slate-400" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold truncate text-sm text-slate-900 dark:text-slate-100">
                                                                {book.title}
                                                            </p>
                                                            {book.author_name?.[0] && (
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                                                                    {book.author_name[0]}
                                                                </p>
                                                            )}
                                                            {book.first_publish_year && (
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    <Calendar className="h-3 w-3 text-slate-400" />
                                                                    <span className="text-xs text-slate-400">{book.first_publish_year}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : debouncedQuery ? (
                                        <div className="p-8 text-center">
                                            <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full mb-3">
                                                <Search className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <p className="text-slate-500 dark:text-slate-400">No books found</p>
                                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Try a different search</p>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center">
                                            <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full mb-3">
                                                <BookOpen className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <p className="text-slate-500 dark:text-slate-400">Start searching</p>
                                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Type to find books</p>
                                        </div>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-8 xl:col-span-9">
                        {selectedBook ? (
                            <div className="space-y-6">
                                <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row gap-6 p-6">
                                            <div className="shrink-0 mx-auto md:mx-0">
                                                {selectedBook.cover_i ? (
                                                    <img
                                                        src={getCoverUrl(selectedBook.cover_i, 'L') || ''}
                                                        alt={selectedBook.title}
                                                        className="w-48 md:w-56 rounded-xl shadow-2xl shadow-slate-300/50 dark:shadow-slate-900/50"
                                                    />
                                                ) : (
                                                    <div className="w-48 h-72 bg-slate-200 dark:bg-slate-600 rounded-xl flex items-center justify-center shadow-xl">
                                                        <BookOpen className="h-20 w-20 text-slate-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 text-center md:text-left">
                                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                                    {selectedBook.title}
                                                </h2>
                                                {authors.length > 0 && (
                                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                                                        <User className="h-4 w-4 text-indigo-500" />
                                                        <span className="text-sm text-slate-600 dark:text-slate-300">
                                                            {authors.join(', ')}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                                                    {subjects.slice(0, 6).map((subject, index) => (
                                                        <Badge key={index} variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                            {subject}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                                    {publishDate && (
                                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                                            <Calendar className="h-4 w-4 text-indigo-500" />
                                                            <span>Published: {publishDate}</span>
                                                        </div>
                                                    )}
                                                    {pages && (
                                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                                            <FileText className="h-4 w-4 text-indigo-500" />
                                                            <span>{pages} pages</span>
                                                        </div>
                                                    )}
                                                    {publishers.length > 0 && (
                                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                                            <Building className="h-4 w-4 text-indigo-500" />
                                                            <span>{publishers.join(', ')}</span>
                                                        </div>
                                                    )}
                                                    {isbns.length > 0 && (
                                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                                            <Globe className="h-4 w-4 text-indigo-500" />
                                                            <span className="text-xs">ISBN: {isbns.slice(0, 2).join(', ')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-3 mt-6 justify-center md:justify-start">
                                                    <Button variant="outline" className="gap-2">
                                                        <Bookmark className="h-4 w-4" />
                                                        Save
                                                    </Button>
                                                    <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                                                        <Star className="h-4 w-4" />
                                                        Rate
                                                    </Button>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setSelectedBook(null)}
                                                className="absolute top-4 right-4 md:static"
                                            >
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </div>

                                        <Tabs defaultValue="details" className="border-t border-slate-200 dark:border-slate-700">
                                            <TabsList className="w-full justify-start rounded-none bg-transparent border-b border-slate-200 dark:border-slate-700 px-6">
                                                <TabsTrigger value="details" className="data-[state=active]:bg-indigo-50 dark:data-[state=active]:bg-indigo-900/20 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-t-lg">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Details
                                                </TabsTrigger>
                                                <TabsTrigger value="editions" className="data-[state=active]:bg-indigo-50 dark:data-[state=active]:bg-indigo-900/20 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-t-lg">
                                                    <BookMarked className="h-4 w-4 mr-2" />
                                                    Editions ({editions?.entries?.length || 0})
                                                </TabsTrigger>
                                                <TabsTrigger value="comments" className="data-[state=active]:bg-indigo-50 dark:data-[state=active]:bg-indigo-900/20 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-t-lg">
                                                    <MessageCircle className="h-4 w-4 mr-2" />
                                                    Comments ({comments.length})
                                                </TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="details" className="p-6 space-y-6">
                                                {firstSentence && (
                                                    <div>
                                                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                                            <FileText className="h-5 w-5 text-indigo-500" />
                                                            First Sentence
                                                        </h3>
                                                        <p className="text-slate-600 dark:text-slate-300 italic">
                                                            "{firstSentence}"
                                                        </p>
                                                    </div>
                                                )}
                                                {bookDetails?.description ? (
                                                    <div>
                                                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                                            <FileText className="h-5 w-5 text-indigo-500" />
                                                            Description
                                                        </h3>
                                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                                            {typeof bookDetails.description === 'object'
                                                                ? bookDetails.description.value
                                                                : bookDetails.description}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 text-slate-500">
                                                        <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                                                        <p>No description available</p>
                                                    </div>
                                                )}
                                            </TabsContent>

                                            <TabsContent value="editions" className="p-6">
                                                {editions?.entries && editions.entries.length > 0 ? (
                                                    <ScrollArea className="h-[400px] pr-4">
                                                        <div className="space-y-3">
                                                            {editions.entries.map((edition, index) => (
                                                                <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                                                    {edition.covers?.[0] ? (
                                                                        <img
                                                                            src={getCoverUrl(edition.covers[0], 'S') || ''}
                                                                            alt={edition.title}
                                                                            className="w-12 h-16 object-cover rounded-lg"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-12 h-16 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                            <BookOpen className="h-5 w-5 text-slate-400" />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium text-slate-900 dark:text-slate-100">
                                                                            {edition.title}
                                                                        </p>
                                                                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                                            {edition.publish_date && (
                                                                                <span className="flex items-center gap-1">
                                                                                    <Calendar className="h-3 w-3" />
                                                                                    {edition.publish_date}
                                                                                </span>
                                                                            )}
                                                                            {edition.publishers?.[0] && (
                                                                                <span className="flex items-center gap-1">
                                                                                    <Building className="h-3 w-3" />
                                                                                    {edition.publishers[0]}
                                                                                </span>
                                                                            )}
                                                                            {edition.number_of_pages && (
                                                                                <span className="flex items-center gap-1">
                                                                                    <FileText className="h-3 w-3" />
                                                                                    {edition.number_of_pages} pages
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </ScrollArea>
                                                ) : (
                                                    <div className="text-center py-12 text-slate-500">
                                                        <BookMarked className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                                                        <p>No editions available</p>
                                                    </div>
                                                )}
                                            </TabsContent>

                                            <TabsContent value="comments" className="p-6">
                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        handleAddComment();
                                                    }}
                                                    className="mb-6"
                                                >
                                                    <div className="space-y-2">
                                                        <Textarea
                                                            placeholder="Share your thoughts about this book..."
                                                            value={newComment}
                                                            onChange={(e) => setNewComment(e.target.value)}
                                                            className="min-h-[120px] resize-none bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center mt-3">
                                                        <span className="text-xs text-slate-400">
                                                            {newComment.length}/500
                                                        </span>
                                                        <Button
                                                            type="submit"
                                                            disabled={!newComment.trim() || newComment.length > 500}
                                                            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                                                        >
                                                            <Send className="h-4 w-4" />
                                                            Post Comment
                                                        </Button>
                                                    </div>
                                                </form>

                                                <Separator className="mb-6" />

                                                <ScrollArea className="h-[350px] pr-4">
                                                    <div className="space-y-4">
                                                        {comments.map((comment) => (
                                                            <div
                                                                key={comment.id}
                                                                className="flex gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800"
                                                            >
                                                                <Avatar className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                                                    <AvatarFallback className="text-sm font-semibold">
                                                                        {comment.avatar}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                                            {comment.author}
                                                                        </span>
                                                                        <span className="text-xs text-slate-400">
                                                                            {comment.date}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                                                        {comment.content}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl">
                                <CardContent className="p-16 text-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full mb-6">
                                        <Layers className="h-10 w-10 text-indigo-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                                        Select a Book
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                        Choose a book from the search results to view its details, description, and community comments.
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

BookSearch.layout = {
    breadcrumbs: [
        {
            title: 'Book Search',
            href: bookRoute(),
        },
    ],
};