import {
    Bookmark,
    BookOpen,
    Calendar,
    Search,
    Send,
    Sparkles,
    Star,
    User,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    getCoverUrl,
    useBookDetails,
    useBookSearch,
    usePreviewReviewSummary,
} from '@/services/bookService';
import { BookReview, useBookStore } from '@/stores/bookStore';
import { book as bookRoute } from '@/routes';

function StarRating({
    rating,
    interactive = false,
    onRate,
}: {
    rating: number;
    interactive?: boolean;
    onRate?: (r: number) => void;
}) {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    className={interactive ? 'cursor-pointer' : 'cursor-default'}
                    onMouseEnter={() => interactive && setHoverRating(star)}
                    onMouseLeave={() => interactive && setHoverRating(0)}
                    onClick={() => interactive && onRate?.(star)}
                >
                    <Star
                        className={cn(
                            'h-4 w-4',
                            (interactive ? hoverRating || rating : rating) >= star
                                ? 'fill-neutral-900 text-neutral-900 dark:fill-neutral-100 dark:text-neutral-100'
                                : 'text-neutral-300 dark:text-neutral-600'
                        )}
                    />
                </button>
            ))}
        </div>
    );
}

function formatDate(dateString: string) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return 'Today';
    }

    return date.toLocaleDateString();
}

function buildSummarySignature(reviews: BookReview[]): string {
    return reviews
        .map((review) => `${review.author}|${review.rating}|${review.content}`)
        .join('||');
}

export default function BookSearch() {
    const {
        searchQuery,
        setSearchQuery,
        selectedBook,
        setSelectedBook,
        savedBooks,
        toggleSavedBook,
        addRecentlyViewed,
        ensurePresetReviewsForBook,
        presetReviewsByBook,
        userReviewsByBook,
        addUserReview,
        summaryByBook,
        setSummaryForBook,
    } = useBookStore();

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
    const previewSummaryMutation = usePreviewReviewSummary();

    const firstBook = useMemo(() => {
        return searchResults && searchResults.length > 0 ? searchResults[0] : null;
    }, [searchResults]);

    useEffect(() => {
        if (firstBook && !selectedBook) {
            const book = {
                key: firstBook.key,
                title: firstBook.title,
                author_name: firstBook.author_name,
                cover_i: firstBook.cover_i,
                first_publish_year: firstBook.first_publish_year,
                number_of_pages_median: firstBook.number_of_pages_median,
                isbn: firstBook.isbn,
            };

            setSelectedBook(book);
            addRecentlyViewed(book);
            ensurePresetReviewsForBook(book);
        }
    }, [
        firstBook,
        selectedBook,
        setSelectedBook,
        addRecentlyViewed,
        ensurePresetReviewsForBook,
    ]);

    const handleBookClick = (
        key: string,
        title: string,
        author_name?: string[],
        cover_i?: number,
        first_publish_year?: number,
        number_of_pages_median?: number,
        isbn?: string[]
    ) => {
        const book = {
            key,
            title,
            author_name,
            cover_i,
            first_publish_year,
            number_of_pages_median,
            isbn,
        };

        setSelectedBook(book);
        addRecentlyViewed(book);
        ensurePresetReviewsForBook(book);
    };

    const presetReviews = selectedBook ? presetReviewsByBook[selectedBook.key] ?? [] : [];
    const userReviews = selectedBook ? userReviewsByBook[selectedBook.key] ?? [] : [];
    const displayedReviews = [...userReviews, ...presetReviews];

    const summarySignature = buildSummarySignature(displayedReviews);
    const cachedSummary = selectedBook ? summaryByBook[selectedBook.key] : undefined;

    const handleAddReview = () => {
        if (!selectedBook || !newReview.trim() || reviewRating === 0) {
            return;
        }

        addUserReview(selectedBook.key, {
            author: 'You',
            content: newReview.trim(),
            rating: reviewRating,
            avatar: 'YO',
        });

        setNewReview('');
        setReviewRating(0);
    };

    const handleSummarize = async () => {
        if (!selectedBook || displayedReviews.length === 0) {
            return;
        }

        try {
            const result = await previewSummaryMutation.mutateAsync({
                title: selectedBook.title,
                reviews: displayedReviews.map((review) => ({
                    author: review.author,
                    rating: review.rating,
                    content: review.content,
                })),
            });

            setSummaryForBook(selectedBook.key, result.summary, summarySignature);
        } catch (error) {
            console.error('Summary generation failed:', error);
        }
    };

    const authorNames = selectedBook?.author_name ?? [];
    const publishDate = bookDetails?.publish_date || selectedBook?.first_publish_year?.toString();

    const isSaved = selectedBook
        ? savedBooks.some((book) => book.key === selectedBook.key)
        : false;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="mb-10 text-center">
                    <h1 className="mb-2 text-4xl font-light text-neutral-900 dark:text-neutral-50">
                        Book Search
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Search books, save them, and view AI summaries of reader opinions
                    </p>
                </div>

                <div className="relative mx-auto mb-8 max-w-xl">
                    <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                        type="text"
                        placeholder="Search by title, author, ISBN..."
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        className="h-12 rounded-xl pl-11"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        Results
                                    </span>
                                    <span className="text-xs text-neutral-400">
                                        {searchResults ? searchResults.length : 0}
                                    </span>
                                </div>
                            </div>

                            <ScrollArea className="h-[500px]">
                                {isLoading ? (
                                    <div className="p-4 text-sm text-neutral-500">Loading...</div>
                                ) : searchResults && searchResults.length > 0 ? (
                                    <div className="p-2">
                                        {searchResults.map((book) => (
                                            <button
                                                key={book.key}
                                                type="button"
                                                onClick={() =>
                                                    handleBookClick(
                                                        book.key,
                                                        book.title,
                                                        book.author_name,
                                                        book.cover_i,
                                                        book.first_publish_year,
                                                        book.number_of_pages_median,
                                                        book.isbn
                                                    )
                                                }
                                                className={cn(
                                                    'mb-2 w-full rounded-xl p-3 text-left transition',
                                                    selectedBook?.key === book.key
                                                        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                                                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                                                )}
                                            >
                                                <div className="flex gap-3">
                                                    {book.cover_i ? (
                                                        <img
                                                            src={getCoverUrl(book.cover_i, 'S') || ''}
                                                            alt={book.title}
                                                            className="h-16 w-12 rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-16 w-12 items-center justify-center rounded-md bg-neutral-200 dark:bg-neutral-700">
                                                            <BookOpen className="h-4 w-4 text-neutral-400" />
                                                        </div>
                                                    )}

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium">
                                                            {book.title}
                                                        </p>
                                                        <p className="truncate text-xs opacity-75">
                                                            {book.author_name?.[0] ?? 'Unknown author'}
                                                        </p>
                                                        <p className="text-xs opacity-60">
                                                            {book.first_publish_year ?? ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-sm text-neutral-500">
                                        Start searching for a book.
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>

                    <div className="lg:col-span-8 xl:col-span-9">
                        {selectedBook ? (
                            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="flex flex-col gap-6 md:flex-row">
                                    <div className="shrink-0">
                                        {selectedBook.cover_i ? (
                                            <img
                                                src={getCoverUrl(selectedBook.cover_i, 'L') || ''}
                                                alt={selectedBook.title}
                                                className="w-40 rounded-xl shadow-lg"
                                            />
                                        ) : (
                                            <div className="flex h-56 w-40 items-center justify-center rounded-xl bg-neutral-200 dark:bg-neutral-700">
                                                <BookOpen className="h-10 w-10 text-neutral-400" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h2 className="text-2xl font-light text-neutral-900 dark:text-neutral-100">
                                                    {selectedBook.title}
                                                </h2>
                                                <div className="mt-2 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                                                    <User className="h-4 w-4" />
                                                    <span>{authorNames.join(', ') || 'Unknown author'}</span>
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setSelectedBook(null)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-3">
                                            {publishDate && (
                                                <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{publishDate}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6 flex flex-wrap gap-3">
                                            <Button
                                                type="button"
                                                onClick={() => selectedBook && toggleSavedBook(selectedBook)}
                                                className="gap-2"
                                            >
                                                <Bookmark
                                                    className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`}
                                                />
                                                {isSaved ? 'Saved' : 'Save'}
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleSummarize}
                                                disabled={
                                                    displayedReviews.length === 0 ||
                                                    previewSummaryMutation.isPending
                                                }
                                                className="gap-2"
                                            >
                                                <Sparkles className="h-4 w-4" />
                                                {previewSummaryMutation.isPending
                                                    ? 'Generating Summary...'
                                                    : 'Generate AI Summary'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <Tabs defaultValue="reviews" className="mt-8">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="details">Details</TabsTrigger>
                                        <TabsTrigger value="reviews">Reviews</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="details" className="mt-6">
                                        {bookDetails?.description ? (
                                            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                                {typeof bookDetails.description === 'object'
                                                    ? bookDetails.description.value
                                                    : bookDetails.description}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                No description available.
                                            </p>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="reviews" className="mt-6">
                                        <div className="mb-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                                <Sparkles className="h-4 w-4" />
                                                AI Summary of reader reviews
                                            </div>

                                            {previewSummaryMutation.isPending ? (
                                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                    Generating summary...
                                                </p>
                                            ) : previewSummaryMutation.isError ? (
                                                <p className="text-sm text-red-600 dark:text-red-400">
                                                    Failed to generate summary.
                                                    {previewSummaryMutation.error instanceof Error
                                                        ? ` ${previewSummaryMutation.error.message}`
                                                        : ''}
                                                </p>
                                            ) : cachedSummary?.text ? (
                                                <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                                    {cachedSummary.text}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                    Click “Generate AI Summary” to summarize the selected reviews for this book.
                                                </p>
                                            )}
                                        </div>

                                        <div className="mb-6">
                                            <div className="mb-3 flex items-center gap-3">
                                                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    Your rating:
                                                </span>
                                                <StarRating
                                                    rating={reviewRating}
                                                    interactive
                                                    onRate={setReviewRating}
                                                />
                                            </div>

                                            <Textarea
                                                placeholder="Write your review here..."
                                                value={newReview}
                                                onChange={(e) => setNewReview(e.target.value)}
                                                className="min-h-[120px]"
                                            />

                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="text-xs text-neutral-400">
                                                    {newReview.length}/1000
                                                </span>

                                                <Button
                                                    type="button"
                                                    onClick={handleAddReview}
                                                    disabled={!newReview.trim() || reviewRating === 0}
                                                    className="gap-2"
                                                >
                                                    <Send className="h-4 w-4" />
                                                    Save Review
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {displayedReviews.length > 0 ? (
                                                displayedReviews.map((review) => (
                                                    <div
                                                        key={review.id}
                                                        className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50"
                                                    >
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                                                    {review.author}
                                                                </span>
                                                                <span
                                                                    className={cn(
                                                                        'rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide',
                                                                        review.source === 'user'
                                                                            ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                                                                            : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200'
                                                                    )}
                                                                >
                                                                    {review.source === 'user'
                                                                        ? 'Your review'
                                                                        : 'Reader review'}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <StarRating rating={review.rating} />
                                                                <span className="text-xs text-neutral-400">
                                                                    {formatDate(review.date)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                            {review.content}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                    No reviews yet.
                                                </p>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-neutral-200 bg-white p-12 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                                    Select a book to view details, save it, and read the AI review summary.
                                </p>
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