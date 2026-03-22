import { Link, useLocation } from "wouter";
import { Search, History, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Search & Analyze", icon: Search },
    { href: "/history", label: "History", icon: History },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" data-testid="link-home">
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SafeStream
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 transform scale-105"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                data-testid={`link-nav-${item.href.replace("/", "") || "home"}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
