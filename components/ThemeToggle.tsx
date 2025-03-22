// "use client";
// import { useTheme } from "next-themes";
// import { useEffect, useState } from "react";

// export default function ThemeToggle() {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null; // Avoid hydration issues

//   return (
//     <button
//       className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-black dark:text-white transition"
//       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//     >
//       {theme === "dark" ? "Light Mode" : "Dark Mode"}
//     </button>
//   );
// }
