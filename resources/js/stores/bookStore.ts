import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MOCK_BOOK_REVIEW_POOL } from '@/data/mockBookReviews';

export interface Book {
    key: string;
    title: string;
    author_name?: string[];
    cover_i?: number;
    first_publish_year?: number;
    number_of_pages_median?: number;
    isbn?: string[];
}

export interface BookReview {
    id: string;
    author: string;
    content: string;
    rating: number;
    date: string;
    avatar?: string;
    source: 'preset' | 'user';
}

interface BookStore {
    searchQuery: string;
    setSearchQuery: (query: string) => void;

    selectedBook: Book | null;
    setSelectedBook: (book: Book | null) => void;

    savedBooks: Book[];
    toggleSavedBook: (book: Book) => void;

    recentlyViewed: Book[];
    addRecentlyViewed: (book: Book) => void;

    presetReviewsByBook: Record<string, BookReview[]>;
    ensurePresetReviewsForBook: (book: Book) => void;

    userReviewsByBook: Record<string, BookReview[]>;
    addUserReview: (bookKey: string, review: Omit<BookReview, 'id' | 'date' | 'source'>) => void;

    summaryByBook: Record<string, { text: string; signature: string }>;
    setSummaryForBook: (bookKey: string, text: string, signature: string) => void;
}

const noopStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
};

function hashString(value: string): number {
    let hash = 0;

    for (let i = 0; i < value.length; i += 1) {
        hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    }

    return hash;
}

function seededShuffle<T>(items: T[], seedText: string): T[] {
    const result = [...items];
    let seed = hashString(seedText);

    for (let i = result.length - 1; i > 0; i -= 1) {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        const j = seed % (i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function generatePresetReviews(book: Book): BookReview[] {
    const shuffled = seededShuffle(MOCK_BOOK_REVIEW_POOL, book.key);
    const count = 3 + (hashString(book.title) % 2);
    const selected = shuffled.slice(0, count);

    return selected.map((review, index) => ({
        id: `preset-${book.key}-${index}`,
        author: review.author,
        content: review.content,
        rating: review.rating,
        avatar: review.avatar,
        date: '2026-04-16',
        source: 'preset',
    }));
}

export const useBookStore = create<BookStore>()(
    persist(
        (set, get) => ({
            searchQuery: '',
            setSearchQuery: (query) => set({ searchQuery: query }),

            selectedBook: null,
            setSelectedBook: (book) => set({ selectedBook: book }),

            savedBooks: [],
            toggleSavedBook: (book) =>
                set((state) => {
                    const exists = state.savedBooks.some((savedBook) => savedBook.key === book.key);

                    return {
                        savedBooks: exists
                            ? state.savedBooks.filter((savedBook) => savedBook.key !== book.key)
                            : [book, ...state.savedBooks],
                    };
                }),

            recentlyViewed: [],
            addRecentlyViewed: (book) =>
                set((state) => {
                    const filtered = state.recentlyViewed.filter(
                        (recentBook) => recentBook.key !== book.key
                    );

                    return {
                        recentlyViewed: [book, ...filtered].slice(0, 8),
                    };
                }),

            presetReviewsByBook: {},
            ensurePresetReviewsForBook: (book) => {
                const existing = get().presetReviewsByBook[book.key];

                if (existing) {
                    return;
                }

                set((state) => ({
                    presetReviewsByBook: {
                        ...state.presetReviewsByBook,
                        [book.key]: generatePresetReviews(book),
                    },
                }));
            },

            userReviewsByBook: {},
            addUserReview: (bookKey, review) =>
                set((state) => ({
                    userReviewsByBook: {
                        ...state.userReviewsByBook,
                        [bookKey]: [
                            {
                                id: `user-${bookKey}-${Date.now()}`,
                                author: review.author,
                                content: review.content,
                                rating: review.rating,
                                avatar: review.avatar,
                                date: new Date().toISOString(),
                                source: 'user',
                            },
                            ...(state.userReviewsByBook[bookKey] ?? []),
                        ],
                    },
                })),

            summaryByBook: {},
            setSummaryForBook: (bookKey, text, signature) =>
                set((state) => ({
                    summaryByBook: {
                        ...state.summaryByBook,
                        [bookKey]: { text, signature },
                    },
                })),
        }),
        {
            name: 'book-demo-store',
            storage: createJSONStorage(() =>
                typeof window !== 'undefined' ? localStorage : noopStorage
            ),
            partialize: (state) => ({
                savedBooks: state.savedBooks,
                recentlyViewed: state.recentlyViewed,
                presetReviewsByBook: state.presetReviewsByBook,
                userReviewsByBook: state.userReviewsByBook,
                summaryByBook: state.summaryByBook,
            }),
        }
    )
);