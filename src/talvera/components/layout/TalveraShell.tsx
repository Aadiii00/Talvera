import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TalveraBrand, TalveraNav, TalveraSidebar } from "./TalveraSidebar";
import { TalveraTopBar } from "./TalveraTopBar";
import { CommandPalette } from "@/talvera/components/command/CommandPalette";
import { FloatingAIButton } from "@/talvera/components/ai/FloatingAIButton";
import { AIDrawer } from "@/talvera/components/ai/AIDrawer";
import { PageTransition } from "@/talvera/components/shared/PageTransition";

export function TalveraShell() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <TalveraSidebar />

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-[240px] gap-0 p-4">
          <div className="mb-6">
            <TalveraBrand />
          </div>
          <TalveraNav onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <TalveraTopBar onOpenSearch={() => setSearchOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-5 lg:px-8 lg:py-7">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </main>
      </div>

      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
      <FloatingAIButton onClick={() => setAiOpen(true)} />
      <AIDrawer open={aiOpen} onOpenChange={setAiOpen} />
    </div>
  );
}
