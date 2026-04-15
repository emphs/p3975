import { Search, BookOpen, Calendar, FileText, X, MessageCircle, Send, Star, Bookmark, User, Building, Globe, BookMarked } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
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
import type { Review } from '@/stores/bookStore';
import { book as bookRoute } from '@/routes';

function StarRating({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    className={cn(
                        'transition-colors duration-150',
                        interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                    )}
                    onMouseEnter={() => interactive && setHoverRating(star)}
                    onMouseLeave={() => interactive && setHoverRating(0)}
                    onClick={() => interactive && onRate?.(star)}
                >
                    <Star
                        className={cn(
                            'h-4 w-4 transition-colors',
                            (interactive ? hoverRating || rating : rating) >= star
                                ? 'fill-neutral-900 dark:fill-neutral-100 text-neutral-900 dark:text-neutral-100'
                                : 'text-neutral-300 dark:text-neutral-600'
                        )}
                    />
                </button>
            ))}
        </div>
    );
}

export default function BookSearch() {
    const { searchQuery, setSearchQuery, selectedBook, setSelectedBook, reviews, addReview } = useBookStore();
    const [localQuery, setLocalQuery] = useState(searchQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const [newReview, setNewReview] = useState('');
    const [reviewRating, setReviewRating] = useState(0);

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

    const handleAddReview = () => {
        if (!newReview.trim() || newReview.length > 500 || reviewRating === 0) return;

        const review: Review = {
            id: Date.now().toString(),
            author: 'You',
            content: newReview,
            rating: reviewRating,
            date: new Date().toISOString().split('T')[0],
            avatar: 'Y',
        };
        addReview(review);
        setNewReview('');
        setReviewRating(0);
    };

    const handleBookClick = (key: string, title: string, cover_i?: number, first_publish_year?: number) => {
        setSelectedBook({ key, title, cover_i, first_publish_year });
    };

    const authors = bookDetails?.authors?.map((a) => a.author.key) || [];
    const publishers = bookDetails?.publishers || [];
    const publishDate = bookDetails?.publish_date || selectedBook?.first_publish_year?.toString();
    const pages = bookDetails?.number_of_pages || selectedBook?.number_of_pages_median;
    const subjects = bookDetails?.subjects || [];
    const firstSentence = bookDetails?.first_sentence?.[0];
    const isbns = [...(bookDetails?.isbn_10 || []), ...(bookDetails?.isbn_13 || [])];

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
        percentage: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
    }));

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl mb-6 shadow-sm">
                        <svg className="w-10 h-10 text-neutral-700 dark:text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 dark:text-neutral-50 mb-4">
                        Library
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-base font-light tracking-wide">
                        Explore the world's knowledge
                    </p>
                </div>

                <div className="relative mb-10 max-w-xl mx-auto">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-neutral-600 dark:group-focus-within:text-neutral-400 transition-colors duration-200" />
                        <Input
                            type="text"
                            placeholder="Search by title, author, ISBN..."
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            className="pl-14 h-12 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm focus:border-neutral-400 dark:focus:border-neutral-600 transition-all duration-200 placeholder:text-neutral-400"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-neutral-500" />
                                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Results</span>
                                    </div>
                                    <span className="text-xs text-neutral-400 font-light">
                                        {searchResults ? `${searchResults.length}` : '—'}
                                    </span>
                                </div>
                            </div>
                            <ScrollArea className="h-[400px] lg:h-[500px]">
                                {isLoading ? (
                                    <div className="p-4 space-y-3">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="flex gap-3 p-3">
                                                <Skeleton className="w-12 h-16 rounded-lg" />
                                                <div className="flex-1 space-y-2">
                                                    <Skeleton className="h-3 w-full" />
                                                    <Skeleton className="h-2.5 w-2/3" />
                                                    <Skeleton className="h-2 w-1/3" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : searchResults && searchResults.length > 0 ? (
                                    <div className="p-2">
                                        {searchResults.map((book) => (
                                            <button
                                                key={book.key}
                                                onClick={() => handleBookClick(book.key, book.title, book.cover_i, book.first_publish_year)}
                                                className={`w-full text-left p-3 rounded-xl transition-all duration-150 mb-1 ${
                                                    selectedBook?.key === book.key
                                                        ? 'bg-neutral-900 dark:bg-neutral-100 shadow-lg'
                                                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                                }`}
                                            >
                                                <div className="flex gap-3">
                                                    {book.cover_i ? (
                                                        <img
                                                            src={getCoverUrl(book.cover_i, 'S') || ''}
                                                            alt={book.title}
                                                            className={`w-12 h-16 object-cover rounded-md shadow-sm ${
                                                                selectedBook?.key === book.key ? 'ring-2 ring-neutral-400' : ''
                                                            }`}
                                                        />
                                                    ) : (
                                                        <div className={`w-12 h-16 rounded-md flex items-center justify-center flex-shrink-0 ${
                                                            selectedBook?.key === book.key 
                                                                ? 'bg-neutral-600' 
                                                                : 'bg-neutral-200 dark:bg-neutral-700'
                                                        }`}>
                                                            <BookOpen className={`h-5 w-5 ${
                                                                selectedBook?.key === book.key 
                                                                    ? 'text-white' 
                                                                    : 'text-neutral-400'
                                                            }`} />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs font-medium truncate leading-tight ${
                                                            selectedBook?.key === book.key
                                                                ? 'text-white dark:text-neutral-900'
                                                                : 'text-neutral-800 dark:text-neutral-200'
                                                        }`}>
                                                            {book.title}
                                                        </p>
                                                        {book.author_name?.[0] && (
                                                            <p className={`text-xs truncate mt-1 ${
                                                                selectedBook?.key === book.key
                                                                    ? 'text-neutral-300 dark:text-neutral-600'
                                                                    : 'text-neutral-500 dark:text-neutral-400'
                                                            }`}>
                                                                {book.author_name[0]}
                                                            </p>
                                                        )}
                                                        {book.first_publish_year && (
                                                            <span className={`text-xs ${
                                                                selectedBook?.key === book.key
                                                                    ? 'text-neutral-400 dark:text-neutral-500'
                                                                    : 'text-neutral-400'
                                                            }`}>
                                                                {book.first_publish_year}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : debouncedQuery ? (
                                    <div className="p-8 text-center">
                                        <Search className="h-8 w-8 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">No results found</p>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <BookOpen className="h-8 w-8 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Start searching</p>
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>

                    <div className="lg:col-span-8 xl:col-span-9">
                        {selectedBook ? (
                            <div className="space-y-5">
                                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="p-6 md:p-8">
                                        <div className="flex flex-col md:flex-row gap-8">
                                            <div className="shrink-0 mx-auto md:mx-0">
                                                {selectedBook.cover_i ? (
                                                    <img
                                                        src={getCoverUrl(selectedBook.cover_i, 'L') || ''}
                                                        alt={selectedBook.title}
                                                        className="w-36 md:w-44 rounded-xl shadow-xl"
                                                    />
                                                ) : (
                                                    <div className="w-36 h-52 md:w-44 md:h-64 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-lg border border-neutral-200 dark:border-neutral-700">
                                                        <BookOpen className="h-14 w-14 text-neutral-300 dark:text-neutral-600" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h2 className="text-xl md:text-2xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 mb-3 leading-tight">
                                                            {selectedBook.title}
                                                        </h2>
                                                        {authors.length > 0 && (
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <User className="h-3.5 w-3.5 text-neutral-400" />
                                                                <span className="text-sm text-neutral-600 dark:text-neutral-400 font-light">
                                                                    {authors.join(', ')}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setSelectedBook(null)}
                                                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 -mt-1"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </Button>
                                                </div>

                                                {subjects.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-5">
                                                        {subjects.slice(0, 5).map((subject, index) => (
                                                            <span
                                                                key={index}
                                                                className="text-xs px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full border border-neutral-200 dark:border-neutral-700 font-light"
                                                            >
                                                                {subject}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-2 gap-3 mb-6">
                                                    {publishDate && (
                                                        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            <span className="font-light">{publishDate}</span>
                                                        </div>
                                                    )}
                                                    {pages && (
                                                        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                                                            <FileText className="h-3.5 w-3.5" />
                                                            <span className="font-light">{pages} pages</span>
                                                        </div>
                                                    )}
                                                    {publishers.length > 0 && (
                                                        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                                                            <Building className="h-3.5 w-3.5" />
                                                            <span className="font-light truncate">{publishers[0]}</span>
                                                        </div>
                                                    )}
                                                    {isbns.length > 0 && (
                                                        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                                                            <Globe className="h-3.5 w-3.5" />
                                                            <span className="font-light text-xs">ISBN: {isbns[0]}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <StarRating rating={Math.round(Number(averageRating) || 0)} />
                                                        <span className="text-sm text-neutral-500 font-light">
                                                            {averageRating ? `${averageRating} · ${reviews.length} reviews` : 'No reviews'}
                                                        </span>
                                                    </div>
                                                    <Button size="sm" className="gap-2 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900">
                                                        <Bookmark className="h-3.5 w-3.5" />
                                                        <span className="text-xs font-medium">Save</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-neutral-100 dark:border-neutral-800">
                                        <Tabs defaultValue="details" className="w-full">
                                            <TabsList className="w-full justify-start rounded-none bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800 px-4 h-11">
                                                <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 dark:data-[state=active]:bg-neutral-800 dark:data-[state=active]:text-neutral-100 rounded-lg text-xs font-medium text-neutral-500 h-8 px-4">
                                                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                                                    Details
                                                </TabsTrigger>
                                                <TabsTrigger value="editions" className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 dark:data-[state=active]:bg-neutral-800 dark:data-[state=active]:text-neutral-100 rounded-lg text-xs font-medium text-neutral-500 h-8 px-4">
                                                    <BookMarked className="h-3.5 w-3.5 mr-1.5" />
                                                    Editions ({editions?.entries?.length || 0})
                                                </TabsTrigger>
                                                <TabsTrigger value="comments" className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 dark:data-[state=active]:bg-neutral-800 dark:data-[state=active]:text-neutral-100 rounded-lg text-xs font-medium text-neutral-500 h-8 px-4">
                                                    <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                                                    Reviews ({reviews.length})
                                                </TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="details" className="p-6 space-y-5">
                                                {firstSentence && (
                                                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 border border-neutral-100 dark:border-neutral-800">
                                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light italic leading-relaxed">
                                                            "{firstSentence}"
                                                        </p>
                                                    </div>
                                                )}
                                                {bookDetails?.description ? (
                                                    <div>
                                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                                                            {typeof bookDetails.description === 'object'
                                                                ? bookDetails.description.value
                                                                : bookDetails.description}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-neutral-400 font-light text-center py-6">No description available</p>
                                                )}
                                            </TabsContent>

                                            <TabsContent value="editions" className="p-6">
                                                {editions?.entries && editions.entries.length > 0 ? (
                                                    <ScrollArea className="h-[300px] pr-4">
                                                        <div className="space-y-2">
                                                            {editions.entries.map((edition, index) => (
                                                                <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                                                                    {edition.covers?.[0] ? (
                                                                        <img
                                                                            src={getCoverUrl(edition.covers[0], 'S') || ''}
                                                                            alt={edition.title}
                                                                            className="w-10 h-14 object-cover rounded-md"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-10 h-14 bg-neutral-200 dark:bg-neutral-700 rounded-md flex items-center justify-center">
                                                                            <BookOpen className="h-4 w-4 text-neutral-400" />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                                                                            {edition.title}
                                                                        </p>
                                                                        <div className="flex gap-3 mt-1 text-xs text-neutral-400 font-light">
                                                                            {edition.publish_date && <span>{edition.publish_date}</span>}
                                                                            {edition.publishers?.[0] && <span>{edition.publishers[0]}</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </ScrollArea>
                                                ) : (
                                                    <p className="text-sm text-neutral-400 font-light text-center py-8">No editions available</p>
                                                )}
                                            </TabsContent>

                                            <TabsContent value="comments" className="p-6">
                                                <div className="mb-5">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className="text-xs text-neutral-500 font-light">Your rating:</span>
                                                        <StarRating rating={reviewRating} interactive onRate={setReviewRating} />
                                                    </div>
                                                    <Textarea
                                                        placeholder="Share your thoughts about this book..."
                                                        value={newReview}
                                                        onChange={(e) => setNewReview(e.target.value)}
                                                        className="min-h-[100px] resize-none bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-sm font-light rounded-xl"
                                                    />
                                                    <div className="flex justify-between items-center mt-3">
                                                        <span className="text-xs text-neutral-400 font-light">{newReview.length}/500</span>
                                                        <Button
                                                            type="submit"
                                                            size="sm"
                                                            disabled={!newReview.trim() || newReview.length > 500 || reviewRating === 0}
                                                            onClick={handleAddReview}
                                                            className="bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900"
                                                        >
                                                            <Send className="h-3.5 w-3.5 mr-1.5" />
                                                            <span className="text-xs font-medium">Post Review</span>
                                                        </Button>
                                                    </div>
                                                </div>

                                                        {reviews.length > 0 && (
                                                            <>
                                                                <div className="flex items-start gap-8 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800 mb-5">
                                                                    <div className="text-center min-w-[80px]">
                                                                        <div className="text-3xl font-light text-neutral-900 dark:text-neutral-100">{averageRating}</div>
                                                                        <StarRating rating={Math.round(Number(averageRating))} />
                                                                        <div className="text-xs text-neutral-400 font-light mt-1">{reviews.length} reviews</div>
                                                                    </div>
                                                                    <div className="flex-1 space-y-1.5">
                                                                        {ratingDistribution.map(({ star, count, percentage }) => (
                                                                            <div key={star} className="flex items-center gap-2 text-xs">
                                                                                <span className="w-3 text-neutral-500 font-light">{star}</span>
                                                                                <Star className="h-3 w-3 text-neutral-400" />
                                                                                <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                                                                    <div
                                                                                        className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full transition-all duration-300"
                                                                                        style={{ width: `${percentage}%` }}
                                                                                    />
                                                                                </div>
                                                                                <span className="w-6 text-neutral-400 font-light text-right">{count}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800 mb-5">
                                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                                                                        Readers describe this book as "captivating" and "hard to put down." Most appreciate the well-developed characters and immersive storytelling, though some mention the pacing could be tighter. The themes resonate with those interested in personal growth and self-discovery.
                                                                    </p>
                                                                </div>

                                                                <Separator className="bg-neutral-100 dark:bg-neutral-800 mb-5" />
                                                            </>
                                                        )}

                                                <ScrollArea className="h-[250px]">
                                                    <div className="space-y-3">
                                                        {reviews.map((review) => (
                                                            <div key={review.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                                                                <div className="flex items-start gap-3">
                                                                    <Avatar className="h-8 w-8 bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                                                                        <AvatarFallback className="text-xs font-medium">{review.avatar}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center justify-between mb-1">
                                                                            <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{review.author}</span>
                                                                            <div className="flex items-center gap-2">
                                                                                <StarRating rating={review.rating} />
                                                                                <span className="text-xs text-neutral-400 font-light">{review.date}</span>
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                                                                            {review.content}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {reviews.length === 0 && (
                                                            <p className="text-sm text-neutral-400 font-light text-center py-6">No reviews yet</p>
                                                        )}
                                                    </div>
                                                </ScrollArea>
                                            </TabsContent>
                                        </Tabs>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 shadow-sm">
                                <div className="text-center max-w-sm mx-auto">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl mb-5">
                                        <svg className="w-8 h-8 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-light text-neutral-700 dark:text-neutral-300 mb-2">Select a book</h3>
                                    <p className="text-sm text-neutral-400 font-light">Choose from the results to view details and read reviews</p>
                                </div>
                            </div>
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
