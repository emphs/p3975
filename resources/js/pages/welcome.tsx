import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BookSearch from '@/pages/book-search';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

i18n.load('en', {});
i18n.activate('en');

export default function Welcome() {
    return (
        <QueryClientProvider client={queryClient}>
            <I18nProvider i18n={i18n}>
                <BookSearch />
            </I18nProvider>
        </QueryClientProvider>
    );
}
