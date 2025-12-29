"use client";

import Link from "next/link";

import { ChevronDown, LogOut, Moon, Settings, Sun, LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth";
import { toast } from "sonner";

interface DropdownMenuItemType {
    label: string
    href?: string
    onClick?: () => void
    icon: LucideIcon
    variant?: 'default' | 'destructive'
}

export default function HeaderAdmin() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter()
    const { user, isAuthenticated, logout } = useAuthStore()

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/admin')
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated) {
        return null
    }

    const handleLogout = () => {
        logout()
        toast.success('로그아웃 되었습니다.')
        router.push('/admin')
    }

    const dropdownMenuItems: DropdownMenuItemType[] = [
        {
            label: '설정',
            href: '/admin/settings',
            icon: Settings,
        },
        {
            label: '로그아웃',
            onClick: handleLogout,
            icon: LogOut,
            variant: 'destructive',
        }
    ]

    return (
        <header className="border-b border-border backdrop-blur-xl bg-background/50 supports-backdrop-filter:bg-background/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/25">
                        T
                    </div>
                    <span className="text-xl font-bold text-foreground">관리자</span>
                </Link>
                <div className="flex items-center gap-4">
                    <nav className="hidden md:flex items-center gap-6">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                    {user?.email}
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {dropdownMenuItems.map((item, index) => (
                                    <div key={item.label}>
                                        {index > 0 && <DropdownMenuSeparator />}
                                        {item.href ? (
                                            <DropdownMenuItem asChild>
                                                <Link href={item.href} className="flex items-center gap-2">
                                                    <item.icon className="h-4 w-4" />
                                                    {item.label}
                                                </Link>
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem
                                                onClick={item.onClick}
                                                className={cn(
                                                    "flex items-center gap-2",
                                                    item.variant === 'destructive' && "text-destructive"
                                                )}
                                            >
                                                <item.icon className="h-4 w-4" />
                                                {item.label}
                                            </DropdownMenuItem>
                                        )}
                                    </div>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full w-9 h-9 border border-transparent hover:bg-accent hover:text-accent-foreground"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500 dark:text-slate-300" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-600 dark:text-blue-400" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
