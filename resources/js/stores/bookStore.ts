import { create } from 'zustand';

interface Book {
    key: string;
    title: string;
    authors?: { key: string; name: string }[];
    cover_i?: number;
    first_publish_year?: number;
    number_of_pages_median?: number;
    subjects?: string[];
    publishers?: string[];
    isbn?: string[];
    description?: string;
    url?: string;
}

interface BookStore {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedBook: Book | null;
    setSelectedBook: (book: Book | null) => void;
    reviews: Review[];
    addReview: (review: Review) => void;
}

export interface Review {
    id: string;
    author: string;
    content: string;
    rating: number;
    date: string;
    avatar?: string;
}

const fakeReviews: Review[] = [
    {
        id: '1',
        author: 'Sarah Chen',
        content: 'This book changed my perspective entirely. Highly recommend for anyone interested in the subject!',
        rating: 5,
        date: '2024-01-15',
        avatar: 'SC',
    },
    {
        id: '2',
        author: 'Michael Torres',
        content: 'Great read but the pacing was a bit slow in the middle chapters. Overall worth the time.',
        rating: 3,
        date: '2024-01-10',
        avatar: 'MT',
    },
    {
        id: '3',
        author: 'Emily Watson',
        content: 'Absolutely brilliant! The author does an excellent job of breaking down complex concepts.',
        rating: 4,
        date: '2024-01-05',
        avatar: 'EW',
    },
];

export const useBookStore = create<BookStore>((set) => ({
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    selectedBook: null,
    setSelectedBook: (book) => set({ selectedBook: book }),
    reviews: fakeReviews,
    addReview: (review) =>
        set((state) => ({ reviews: [review, ...state.reviews] })),
}));
