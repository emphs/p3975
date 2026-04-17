import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-black dark:text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-center text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Resource Rate Platform
                </span>
            </div>
        </>
    );
}
