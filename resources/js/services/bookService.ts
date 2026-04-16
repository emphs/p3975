import { useMutation, useQuery } from '@tanstack/react-query';

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
    description?: { value: string } | string;
    covers?: number[];
    authors?: { author: { key: string }; type?: { key: string } }[];
    subjects?: string[];
    publishers?: string[];
    publish_date?: string;
    number_of_pages?: number;
    first_sentence?: string[];
    isbn_10?: string[];
    isbn_13?: string[];
}

export interface PreviewSummaryReview {
    author: string;
    content: string;
    rating: number;
}

export interface PreviewSummaryPayload {
    title: string;
    reviews: PreviewSummaryReview[];
}

export interface PreviewSummaryResponse {
    summary: string;
}

async function parseJsonOrThrow(response: Response) {
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
        return response.json();
    }

    const text = await response.text();
    throw new Error(text || 'Unexpected server response.');
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, {
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...(init?.headers ?? {}),
        },
        ...init,
    });

    if (!response.ok) {
        const errorBody = await parseJsonOrThrow(response).catch(() => null);
        const message = errorBody?.message || `Request failed with status ${response.status}`;
        throw new Error(message);
    }

    return parseJsonOrThrow(response) as Promise<T>;
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

async function previewSummary(payload: PreviewSummaryPayload): Promise<PreviewSummaryResponse> {
    return apiFetch<PreviewSummaryResponse>('/api/reviews/preview-summary', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
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

export function usePreviewReviewSummary() {
    return useMutation({
        mutationFn: previewSummary,
    });
}

export function getCoverUrl(
    coverId: number | undefined,
    size: 'S' | 'M' | 'L' = 'M'
): string | null {
    if (!coverId) {
        return null;
    }

    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}