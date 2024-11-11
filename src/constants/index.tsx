import { GalleryHorizontalEnd, Joystick, LayoutDashboard, Swords, Users } from "lucide-react";

export const MENU_ADMIN = [
    {
        label: 'Dashboard',
        link: '/dashboard',
        icon: LayoutDashboard
    },
    {
        label: 'Players',
        link: '/players',
        icon: Joystick
    },
    {
        label: 'Users',
        link: '/users',
        icon: Users
    },
    {
        label: 'Games',
        link: '/games',
        icon: Swords
    },
    {
        label: 'Banners',
        link: '/banners',
        icon: GalleryHorizontalEnd
    }
];