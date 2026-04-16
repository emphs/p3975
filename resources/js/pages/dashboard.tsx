import { Head } from '@inertiajs/react';
import { Bookmark, Clock, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useBookStore } from '@/stores/bookStore';

export default function Dashboard() {
    const savedBooks = useBookStore((state) => state.savedBooks ?? []);
    const recentlyViewed = useBookStore((state) => state.recentlyViewed ?? []);

    return (
        <>
            <Head title="Dashboard" />

            <div className="mx-auto max-w-7xl p-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Your saved books and recently viewed books
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-4 flex items-center gap-2">
                            <Bookmark className="h-4 w-4 text-neutral-500" />
                            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                                Saved Books
                            </h2>
                        </div>

                        {savedBooks.length > 0 ? (
                            <div className="space-y-3">
                                {savedBooks.map((book) => (
                                    <div
                                        key={book.key}
                                        className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
                                    >
                                        <div className="h-14 w-10 overflow-hidden rounded-md bg-neutral-200 dark:bg-neutral-700">
                                            {book.cover_i ? (
                                                <img
                                                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                                                    alt={book.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : null}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                                {book.title}
                                            </p>
                                            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                                                {book.author_name?.[0] ?? 'Unknown author'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                No saved books yet.
                            </p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-4 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-neutral-500" />
                            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                                Recently Viewed
                            </h2>
                        </div>

                        {recentlyViewed.length > 0 ? (
                            <div className="space-y-3">
                                {recentlyViewed.map((book) => (
                                    <div
                                        key={book.key}
                                        className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
                                    >
                                        <div className="h-14 w-10 overflow-hidden rounded-md bg-neutral-200 dark:bg-neutral-700">
                                            {book.cover_i ? (
                                                <img
                                                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                                                    alt={book.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : null}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                                {book.title}
                                            </p>
                                            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                                                {book.author_name?.[0] ?? 'Unknown author'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                No recently viewed books yet.
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback>
                                <User className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                Reader Dashboard
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Track what you save and browse
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}