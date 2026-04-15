import { Head } from '@inertiajs/react';
import { Bookmark, Clock, Star, User, ChevronRight, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { dashboard } from '@/routes';
import { cn } from '@/lib/utils';
import { useBookStore } from '@/stores/bookStore';

const mockHistory = [
    {
        id: '1',
        title: 'The Midnight Library',
        author: 'Matt Haig',
        cover: 'https://covers.openlibrary.org/b/id/10389394-M.jpg',
        date: '2 hours ago',
    },
    {
        id: '2',
        title: 'Atomic Habits',
        author: 'James Clear',
        cover: 'https://covers.openlibrary.org/b/id/12817751-M.jpg',
        date: 'Yesterday',
    },
    {
        id: '3',
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        cover: 'https://covers.openlibrary.org/b/id/12717723-M.jpg',
        date: '3 days ago',
    },
    {
        id: '4',
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        cover: 'https://covers.openlibrary.org/b/id/12817756-M.jpg',
        date: '1 week ago',
    },
];

const mockBookmarks = [
    {
        id: '1',
        title: 'Dune',
        author: 'Frank Herbert',
        cover: 'https://covers.openlibrary.org/b/id/11153217-M.jpg',
        rating: 5,
    },
    {
        id: '2',
        title: '1984',
        author: 'George Orwell',
        cover: 'https://covers.openlibrary.org/b/id/12817710-M.jpg',
        rating: 4,
    },
    {
        id: '3',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        cover: 'https://covers.openlibrary.org/b/id/12817715-M.jpg',
        rating: 4,
    },
    {
        id: '4',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        cover: 'https://covers.openlibrary.org/b/id/12817712-M.jpg',
        rating: 5,
    },
];

function StarDisplay({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={cn(
                        'h-3 w-3',
                        rating >= star
                            ? 'fill-neutral-900 dark:fill-neutral-100 text-neutral-900 dark:text-neutral-100'
                            : 'text-neutral-300 dark:text-neutral-600'
                    )}
                />
            ))}
        </div>
    );
}

function SectionHeader({
    title,
    icon: Icon,
    action,
}: {
    title: string;
    icon: React.ElementType;
    action?: string;
}) {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-neutral-400" />
                <h2 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{title}</h2>
            </div>
            {action && (
                <button className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                    {action}
                    <ChevronRight className="h-3 w-3" />
                </button>
            )}
        </div>
    );
}

export default function Dashboard() {
    const { reviews } = useBookStore();

    return (
        <>
            <Head title="Home" />
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                            <div className="h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900" />
                            <div className="px-6 pb-6">
                                <div className="relative -mt-10 mb-4">
                                    <Avatar className="h-20 w-20 border-4 border-white dark:border-neutral-900 shadow-lg">
                                        <AvatarFallback className="h-20 w-20 text-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                                            <User className="h-8 w-8" />
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <h1 className="text-xl font-light text-neutral-900 dark:text-neutral-100 mb-1">
                                    Alex Morgan
                                </h1>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                                    avident reader
                                </p>
                                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-neutral-100 dark:border-neutral-800">
                                    <div className="text-center">
                                        <div className="text-lg font-light text-neutral-900 dark:text-neutral-100">24</div>
                                        <div className="text-xs text-neutral-400 font-light">Reviews</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-light text-neutral-900 dark:text-neutral-100">12</div>
                                        <div className="text-xs text-neutral-400 font-light">Saved</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-light text-neutral-900 dark:text-neutral-100">156</div>
                                        <div className="text-xs text-neutral-400 font-light">Visits</div>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full mt-4 bg-transparent border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-light">
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
                            <SectionHeader title="My Reviews" icon={Star} action="View all" />

                            <div className="space-y-4">
                                {reviews.slice(0, 3).map((review) => (
                                    <div key={review.id} className="flex gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
                                        <Avatar className="h-10 w-10 bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                                            <AvatarFallback className="text-xs font-medium">{review.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{review.author}</span>
                                                <div className="flex items-center gap-2">
                                                    <StarDisplay rating={review.rating} />
                                                    <span className="text-xs text-neutral-400 font-light">{review.date}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed line-clamp-2">
                                                {review.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {reviews.length === 0 && (
                                    <div className="text-center py-8">
                                        <Star className="h-8 w-8 mx-auto mb-2 text-neutral-300 dark:text-neutral-600" />
                                        <p className="text-sm text-neutral-400 font-light">No reviews yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
                            <SectionHeader title="Bookmarks" icon={Bookmark} action="View all" />

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {mockBookmarks.map((book) => (
                                    <div key={book.id} className="group">
                                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                                            {book.cover ? (
                                                <img
                                                    src={book.cover}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Bookmark className="h-8 w-8 text-neutral-300 dark:text-neutral-600" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                                                    <Bookmark className="h-4 w-4 text-white fill-white" />
                                                </button>
                                                <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                                                    <Trash2 className="h-4 w-4 text-white" />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">{book.title}</h3>
                                        <p className="text-xs text-neutral-400 font-light truncate">{book.author}</p>
                                        <div className="mt-1">
                                            <StarDisplay rating={book.rating} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
                            <SectionHeader title="Browse History" icon={Clock} action="Clear all" />

                            <div className="space-y-2">
                                {mockHistory.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                                    >
                                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                                            {item.cover ? (
                                                <img
                                                    src={item.cover}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Bookmark className="h-5 w-5 text-neutral-300 dark:text-neutral-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs text-neutral-400 font-light truncate">{item.author}</p>
                                        </div>
                                        <span className="text-xs text-neutral-400 font-light whitespace-nowrap">{item.date}</span>
                                        <ChevronRight className="h-4 w-4 text-neutral-300 dark:text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Home',
            href: dashboard(),
        },
    ],
};
