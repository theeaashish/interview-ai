// 'use client';

// import { usePathname } from "next/navigation";
// import NavBar from "./NavBar";

// export default function NavBarWrapper() {
//     const pathname = usePathname();
//     const hiddenNavBarRoutes = ['/interview/new', '/interview/id'];

//     if (hiddenNavBarRoutes.includes(pathname)) {
//         return null;
//     }

//     return <NavBar />;
// }

"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function NavBarWrapper() {
  const pathname = usePathname();
  const hiddenNavBarRoutes = ["/interview/new"];

  // Hide navbar for dynamic interview ID pages
  if (
    hiddenNavBarRoutes.includes(pathname) ||
    pathname.startsWith("/interview/")
  ) {
    return null;
  }

  return <NavBar />;
}
