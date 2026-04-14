import { useQuery } from '@tanstack/react-query';

export interface OpenLibraryBook {
    key: string;
    title: string;
    author_name?: string[];
    cover_i?: number;
    first_publish_year?: number;
    number_of_pages_median?: number;
    subject?: string[];
    publisher?: string[];
    isbn?: string[];
}

export interface OpenLibrarySearchResponse {
    numFound: number;
    docs: OpenLibraryBook[];
}

export interface BookDetails {
    key: string;
    title: string;
    description?: { value: string };
    covers?: number[];
    authors?: { author: { key: string }; type?: { key: string } }[];
    subjects?: string[];
    publishers?: string[];
    publish_date?: string;
    number_of_pages?: number;
}

async function searchBooks(query: string): Promise<OpenLibraryBook[]> {
    if (!query.trim()) {
return [];
}

    const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`
    );
    const data: OpenLibrarySearchResponse = await response.json();

    return data.docs;
}

async function getBookDetails(key: string): Promise<BookDetails> {
    const response = await fetch(`https://openlibrary.org${key}.json`);

    return response.json();
}

async function getAuthorName(authorKey: string): Promise<{ name: string }> {
    const response = await fetch(`https://openlibrary.org${authorKey}.json`);

    return response.json();
}

export function useBookSearch(query: string) {
    return useQuery({
        queryKey: ['books', query],
        queryFn: () => searchBooks(query),
        enabled: query.trim().length > 0,
        staleTime: 1000 * 60 * 5,
    });
}

export function useBookDetails(key: string | null) {
    return useQuery({
        queryKey: ['book', key],
        queryFn: () => (key ? getBookDetails(key) : Promise.resolve(null)),
        enabled: !!key,
        staleTime: 1000 * 60 * 30,
    });
}

export function useAuthorName(authorKey: string | null) {
    return useQuery({
        queryKey: ['author', authorKey],
        queryFn: () => (authorKey ? getAuthorName(authorKey) : Promise.resolve(null)),
        enabled: !!authorKey,
        staleTime: 1000 * 60 * 30,
    });
}

export function getCoverUrl(coverId: number | undefined, size: 'S' | 'M' | 'L' = 'M'): string | null {
    if (!coverId) {
return null;
}

    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}
