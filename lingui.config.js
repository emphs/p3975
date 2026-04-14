export default {
    locales: ['en'],
    sourceLocale: 'en',
    catalogs: [
        {
            path: 'resources/js/locales/{locale}',
            include: ['resources/js'],
            exclude: ['**/node_modules/**'],
        },
    ],
};
