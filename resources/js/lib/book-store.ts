import { create } from 'zustand';
export interface BookAuthor {
    name: string;
    key?: string;
}
export interface BookCover {
    small?: string;
    medium?: string;
    large?: string;
}
export interface Book {
    key: string;
    title: string;
    authors: BookAuthor[];
    publishDate?: string;
    publishers?: string[];
    numberOfPages?: number;
    covers?: number[];
    subjects?: string[];
    description?: string;
    isbn_10?: string[];
    isbn_13?: string[];
}
export interface Comment {
    id: string;
    author: string;
    avatar?: string;
    content: string;
    date: string;
    rating?: number;
}
interface BookStore {
    currentBook: Book | null;
    comments: Comment[];
    searchHistory: string[];
    setCurrentBook: (book: Book | null) => void;
    addComment: (comment: Omit<Comment, 'id' | 'date'>) => void;
    addToSearchHistory: (isbn: string) => void;
    clearSearchHistory: () => void;
}
const fakeComments: Comment[] = [
    {
        id: '1',
        author: 'Sarah Chen',
        content: 'Absolutely loved this book! The character development was exceptional and the world-building kept me engaged from start to finish.',
        date: '2024-01-15',
        rating: 5,
    },
    {
        id: '2',
        author: 'Marcus Johnson',
        content: 'Great read but the pacing was a bit slow in the middle. Overall would recommend to anyone who enjoys this genre.',
        date: '2024-01-10',
        rating: 4,
    },
    {
        id: '3',
        author: 'Emily Rodriguez',
        content: 'This was my first book by this author and I will definitely be reading more. The writing style is captivating!',
        date: '2024-01-05',
        rating: 5,
    },
    {
        id: '4',
        author: 'David Kim',
        content: 'Interesting perspective on the subject matter. Some parts felt a bit repetitive but the ending made it all worthwhile.',
        date: '2023-12-28',
        rating: 3,
    },
];
export const useBookStore = create<BookStore>((set) => ({
    currentBook: null,
    comments: fakeComments,
    searchHistory: [],
    setCurrentBook: (book) => set({ currentBook: book }),
    addComment: (comment) =>
        set((state) => ({
            comments: [
                {
                    ...comment,
                    id: crypto.randomUUID(),
                    date: new Date().toISOString().split('T')[0],
                },
                ...state.comments,
            ],
        })),
    addToSearchHistory: (isbn) =>
        set((state) => ({
            searchHistory: [isbn, ...state.searchHistory.filter((i) => i !== isbn)].slice(0, 10),
        })),
    clearSearchHistory: () => set({ searchHistory: [] }),
}));
