import { MessageCircleMore } from "lucide-react";

interface FloatingAIButtonProps {
  onClick: () => void;
}

export function FloatingAIButton({ onClick }: FloatingAIButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-teal opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-status-teal" />
      </span>
      <MessageCircleMore className="h-4 w-4" />
      Ask Talvera
    </button>
  );
}
