'use client'

import { useEffect, useState } from "react"
import { Brain, LayoutDashboard, LogOut, MessageCircleCode, BarChart3 } from "lucide-react" // Added BarChart3
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  const isAuthPage = pathname.startsWith('/auth');
  if (isAuthPage) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-blue-100/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5 transition-all">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200 transition-transform group-hover:scale-110">
            <Brain className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-[#0f172a]">Examy</span>
        </Link>

        {/* Navigation - Manual Blue-Gray */}
        <nav className="hidden items-center md:flex">
          {["Features"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-bold text-[#475569] transition-colors hover:text-blue-600"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* AI CHAT BOT BUTTON */}
              <Link href={"/chatbot"}>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative hidden items-center gap-2 overflow-hidden border-blue-200 bg-blue-50/50 font-bold text-blue-700 hover:bg-blue-100 sm:flex rounded-xl transition-all active:scale-95"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  <MessageCircleCode className="h-4 w-4" />
                  Examy Bot
                </Button>
              </Link>

              {/* ANALYTICS LINK - NEW */}
              <Link 
                href="/analytics" 
                className={`flex items-center gap-2 px-3 text-sm font-bold transition-all ${
                  pathname === '/analytics' ? 'text-blue-600' : 'text-[#1e293b] hover:text-blue-600'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </Link>

              <Link 
                href="/dashboard" 
                className={`flex items-center gap-2 px-3 text-sm font-bold transition-all ${
                  pathname === '/dashboard' ? 'text-blue-600' : 'text-[#1e293b] hover:text-blue-600'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 font-bold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hidden text-sm font-bold text-[#1e293b] hover:text-blue-600 md:block transition-colors">
                Log in
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="rounded-xl bg-[#0f172a] px-5 font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}