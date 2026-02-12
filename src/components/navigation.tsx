"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Menu,
  LayoutDashboard,
  LogOut,
  LogIn,
  Sparkles,
  Zap,
  Archive,
  Settings,
} from "lucide-react";

export function Navigation() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-background/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-foreground font-semibold text-lg tracking-tight hidden sm:block">
              AI Finance Brief
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/#features" className="text-muted-foreground hover:text-foreground">
                <Sparkles className="w-4 h-4 mr-1.5" />
                Features
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/#pricing" className="text-muted-foreground hover:text-foreground">
                <Zap className="w-4 h-4 mr-1.5" />
                Beta Access
              </Link>
            </Button>
            {session?.user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                    <LayoutDashboard className="w-4 h-4 mr-1.5" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/archive" className="text-muted-foreground hover:text-foreground">
                    <Archive className="w-4 h-4 mr-1.5" />
                    Archive
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/settings" className="text-muted-foreground hover:text-foreground">
                    <Settings className="w-4 h-4 mr-1.5" />
                    Settings
                  </Link>
                </Button>
                <Separator orientation="vertical" className="mx-2 h-6" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Separator orientation="vertical" className="mx-2 h-6" />
                <Button size="sm" asChild className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                  <Link href="/signin">
                    <LogIn className="w-4 h-4 mr-1.5" />
                    Sign In
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background/95 backdrop-blur-xl border-white/[0.06]">
              <div className="flex flex-col gap-1 mt-8">
                <SheetClose asChild>
                  <Link
                    href="/#features"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Features
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/#pricing"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    Beta Access
                  </Link>
                </SheetClose>
                {session?.user ? (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/archive"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
                      >
                        <Archive className="w-4 h-4" />
                        Archive
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </SheetClose>
                    <Separator className="my-2" />
                    <button
                      onClick={() => {
                        signOut();
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Separator className="my-2" />
                    <SheetClose asChild>
                      <Link href="/signin">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
                          <LogIn className="w-4 h-4 mr-1.5" />
                          Sign In
                        </Button>
                      </Link>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
