import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                fill="currentColor"
                d="M18 2H8a4 4 0 0 0-4 4v12a2 2 0 0 0 2 2h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Zm-1 16H6V6a2 2 0 0 1 2-2h9v14ZM8 4a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h9V4H8Z"
            />
        </svg>
    );
}
