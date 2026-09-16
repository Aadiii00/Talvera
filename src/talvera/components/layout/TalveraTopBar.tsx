import { Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/talvera/components/shared/SearchBar";

interface TalveraTopBarProps {
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
}

export function TalveraTopBar({ onOpenSearch, onOpenMobileNav }: TalveraTopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border/80 bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:px-6">
      <Button variant="ghost" size="icon" className="shrink-0 lg:hidden" onClick={onOpenMobileNav}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open navigation</span>
      </Button>

      <div className="flex flex-1 items-center justify-center px-1 lg:px-8">
        <SearchBar onClick={onOpenSearch} />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden items-center gap-1.5 rounded-full bg-status-green-soft px-2.5 py-1 text-[11px] font-semibold text-status-green sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-status-green" />
          AI Online
        </span>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarFallback className="bg-primary text-[11px] font-semibold text-primary-foreground">
              HR
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col leading-tight md:flex">
            <span className="text-xs font-semibold text-foreground">Sarah Jenkins</span>
            <span className="text-[10.5px] text-muted-foreground">Chief People Officer</span>
          </div>
        </div>
      </div>
    </header>
  );
}
