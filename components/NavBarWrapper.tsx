'use client';

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function NavBarWrapper() {
    const pathname = usePathname();
    const hiddenNavBarRoutes = ['/interview/new'];

    if (hiddenNavBarRoutes.includes(pathname)) {
        return null;
    }

    return <NavBar />;
}