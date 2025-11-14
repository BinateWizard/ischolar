"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function Chrome() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname?.startsWith('/admin');
  const isAuthPage = pathname === '/signin' || pathname === '/signup';

  return (
    <>
      {!isAdmin && !isAuthPage && <Navbar />}
      {/* Footer will decide itself for home/forceRender, but we also hide on admin and auth pages here */}
      {!isAdmin && !isAuthPage && <Footer />}
    </>
  );
}
