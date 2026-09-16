import { Search } from "lucide-react";

interface SearchBarProps {
  onClick: () => void;
}

export function SearchBar({ onClick }: SearchBarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full max-w-md items-center gap-2.5 rounded-full border border-border bg-secondary/60 px-4 py-2 text-left text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:bg-secondary"
    >
      <Search className="h-4 w-4 shrink-0 opacity-60" />
      <span className="flex-1 truncate">Search workforce, skills, policies...</span>
      <kbd className="hidden shrink-0 items-center gap-0.5 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
        <span>⌘</span>K
      </kbd>
    </button>
  );
}
